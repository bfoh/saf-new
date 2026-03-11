import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserRole } from '../enums';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const isDev = process.env.NODE_ENV !== 'production';

        // No token at all in dev → inject mock user based on route
        if (!request.headers.authorization && isDev) {
            this.injectMockUser(request);
            return true;
        }

        // Token present → try real JWT validation
        try {
            return await (super.canActivate(context) as Promise<boolean>);
        } catch {
            // Token present but invalid — in dev only, fall back to mock user
            // so admin portal works even if JWT secret isn't configured locally
            if (isDev) {
                this.injectMockUser(request);
                return true;
            }
            return false;
        }
    }

    // Student-only URL segments — anything else defaults to admin in dev
    private readonly STUDENT_URL_SEGMENTS = ['student', 'vocabulary', 'dashboard/progress', 'lesson'];
    private readonly TEACHER_URL_SEGMENTS = ['teacher', 'instructor', 'attendance'];

    private injectMockUser(request: any) {
        const url: string = request.url || '';

        if (this.TEACHER_URL_SEGMENTS.some(seg => url.includes(seg))) {
            request.user = { id: '00000000-0000-0000-0000-000000000003', role: UserRole.TEACHER, email: 'teacher@safinstitute.com' };
        } else if (this.STUDENT_URL_SEGMENTS.some(seg => url.includes(seg))) {
            request.user = { id: '00000000-0000-0000-0000-000000000001', role: UserRole.STUDENT, email: 'student@safinstitute.com', cefrLevel: 'A1' };
        } else {
            // Default to admin for all other routes (exams, analytics, users, billing, classes, etc.)
            request.user = { id: '00000000-0000-0000-0000-000000000002', role: UserRole.ADMIN, email: 'admin@safinstitute.com' };
        }
    }
}
