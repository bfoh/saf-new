import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        // Try ConfigService first, fall back to process.env directly
        const secret =
            configService.get<string>('SUPABASE_JWT_SECRET') ||
            process.env.SUPABASE_JWT_SECRET;

        // Startup diagnostic — visible in Render logs
        console.log(
            '[JwtStrategy] SUPABASE_JWT_SECRET loaded:',
            secret ? `yes (${secret.length} chars)` : 'NO — JWT auth will fail!',
        );

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
            algorithms: ['HS256'], // Supabase uses HS256
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
