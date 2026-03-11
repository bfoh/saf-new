import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

class SyncProfileDto {
    @IsString() userId: string;
    @IsEmail() email: string;
    @IsString() firstName: string;
    @IsString() lastName: string;
    @IsOptional() @IsString() role?: string;
    @IsOptional() @IsString() cefrLevel?: string;
}

class InviteInstructorDto {
    @IsEmail() email: string;
    @IsString() firstName: string;
    @IsString() lastName: string;
    @IsOptional() @IsString() role?: string;
    @IsOptional() @IsString() branch?: string;
}

class EnrollStudentDto {
    @IsEmail() email: string;
    @IsString() firstName: string;
    @IsString() lastName: string;
    @IsOptional() @IsString() cefrLevel?: string;
    @IsOptional() @IsString() visaStatus?: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // GET /api/auth/me — returns current user profile (JWT protected)
    @Get('me')
    async getMe(@CurrentUser() user: User) {
        return this.authService.getProfile(user.id);
    }

    // POST /api/auth/sync-profile — called after Supabase signup to upsert profile data
    // The request body must include userId (the Supabase auth user UUID)
    @Public()
    @Post('sync-profile')
    @HttpCode(HttpStatus.OK)
    async syncProfile(@Body() dto: SyncProfileDto) {
        if (!dto.userId) {
            return { message: 'userId required' };
        }
        return this.authService.syncProfile(dto.userId, {
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: dto.role,
            cefrLevel: dto.cefrLevel,
        });
    }

    // POST /api/auth/invite-instructor — requires authentication (route is already admin-gated by Next.js middleware)
    @Post('invite-instructor')
    async inviteInstructor(
        @Body() dto: InviteInstructorDto,
    ) {
        return this.authService.inviteInstructor(dto.email, dto.firstName, dto.lastName, dto.role, dto.branch);
    }

    // POST /api/auth/enroll-student — creates Supabase auth account + DB profile, sends invite email
    @Post('enroll-student')
    async enrollStudent(@Body() dto: EnrollStudentDto) {
        return this.authService.enrollStudent(dto.email, dto.firstName, dto.lastName, dto.cefrLevel, dto.visaStatus);
    }
}
