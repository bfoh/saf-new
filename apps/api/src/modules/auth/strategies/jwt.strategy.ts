import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import * as crypto from 'crypto';
import * as https from 'https';

interface SupabaseJwtPayload {
    sub: string;
    email: string;
    role: string; // 'authenticated' — Supabase's internal role
    app_metadata: {
        role?: string; // our custom role: student | instructor | admin
    };
    user_metadata: {
        first_name?: string;
        last_name?: string;
    };
    iat: number;
    exp: number;
}

/**
 * Fetch JWKS from Supabase and convert the first key to PEM format.
 * This is needed because Supabase now signs JWTs with ES256 (ECDSA).
 */
async function fetchJwksPem(supabaseUrl: string): Promise<string | null> {
    const jwksUrl = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;
    return new Promise((resolve) => {
        https.get(jwksUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    const jwks = JSON.parse(data);
                    if (jwks.keys?.length > 0) {
                        const publicKey = crypto.createPublicKey({
                            key: jwks.keys[0],
                            format: 'jwk',
                        });
                        resolve(publicKey.export({ type: 'spki', format: 'pem' }) as string);
                    } else {
                        resolve(null);
                    }
                } catch {
                    resolve(null);
                }
            });
            res.on('error', () => resolve(null));
        }).on('error', () => resolve(null));
    });
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        const supabaseUrl =
            configService.get<string>('SUPABASE_URL') ||
            process.env.SUPABASE_URL ||
            '';

        const hmacSecret =
            configService.get<string>('SUPABASE_JWT_SECRET') ||
            process.env.SUPABASE_JWT_SECRET;

        console.log('[JwtStrategy] Supabase URL:', supabaseUrl || 'NOT SET');
        console.log('[JwtStrategy] HMAC secret loaded:', hmacSecret ? `yes (${hmacSecret.length} chars)` : 'no');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // Use secretOrKeyProvider to dynamically choose between ES256 (JWKS) and HS256 (HMAC)
            secretOrKeyProvider: (
                _request: any,
                rawJwtToken: string,
                done: (err: any, secret?: string | Buffer) => void,
            ) => {
                try {
                    // Decode the JWT header to check the algorithm
                    const headerB64 = rawJwtToken.split('.')[0];
                    const header = JSON.parse(
                        Buffer.from(headerB64, 'base64url').toString('utf8'),
                    );

                    if (header.alg === 'ES256' && supabaseUrl) {
                        // ES256 — fetch public key from Supabase JWKS endpoint
                        fetchJwksPem(supabaseUrl)
                            .then((pem) => {
                                if (pem) {
                                    done(null, pem);
                                } else {
                                    done(new Error('Could not fetch JWKS public key from Supabase'));
                                }
                            })
                            .catch((err) => done(err));
                        return;
                    }

                    // HS256 fallback — use the HMAC secret
                    if (hmacSecret) {
                        return done(null, hmacSecret);
                    }

                    return done(new Error('No suitable key found for JWT verification'));
                } catch (err) {
                    return done(err);
                }
            },
            algorithms: ['ES256', 'HS256'],
        });
    }

    async validate(payload: SupabaseJwtPayload) {
        const appRole = payload.app_metadata?.role || 'student';

        // Try to find the profile; if it doesn't exist yet, return minimal user object
        try {
            const profile = await this.usersService.findById(payload.sub);
            if (profile) {
                // Sync DB role from JWT app_metadata so stale DB rows are healed on every request
                profile.role = appRole as typeof profile.role;
                return profile;
            }
            // Profile not yet created — return minimal object
            return {
                id: payload.sub,
                email: payload.email,
                role: appRole,
                firstName: payload.user_metadata?.first_name || '',
                lastName: payload.user_metadata?.last_name || '',
                isActive: true,
            };
        } catch {
            return {
                id: payload.sub,
                email: payload.email,
                role: appRole,
                firstName: payload.user_metadata?.first_name || '',
                lastName: payload.user_metadata?.last_name || '',
                isActive: true,
            };
        }
    }
}
