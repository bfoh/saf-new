import * as crypto from 'crypto';
import * as https from 'https';
import * as jwt from 'jsonwebtoken';

let cachedPem: string | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetch JWKS from Supabase and convert to PEM (cached).
 */
async function getJwksPem(supabaseUrl: string): Promise<string | null> {
    if (cachedPem && Date.now() < cacheExpiry) return cachedPem;

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
                        cachedPem = publicKey.export({ type: 'spki', format: 'pem' }) as string;
                        cacheExpiry = Date.now() + CACHE_TTL_MS;
                        resolve(cachedPem);
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

/**
 * Verify a Supabase JWT (supports both ES256 and HS256).
 * Returns the decoded payload, or null if invalid.
 */
export async function verifySupabaseJwt(
    token: string,
    supabaseUrl: string,
    hmacSecret?: string,
): Promise<jwt.JwtPayload | null> {
    const headerB64 = token.split('.')[0];
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));

    if (header.alg === 'ES256' && supabaseUrl) {
        const pem = await getJwksPem(supabaseUrl);
        if (!pem) return null;
        return jwt.verify(token, pem, { algorithms: ['ES256'] }) as jwt.JwtPayload;
    }

    if (hmacSecret) {
        return jwt.verify(token, hmacSecret, { algorithms: ['HS256'] }) as jwt.JwtPayload;
    }

    return null;
}
