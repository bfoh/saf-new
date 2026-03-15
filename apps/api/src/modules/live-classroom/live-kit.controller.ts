import { Controller, Get, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { LiveClassroomService } from './live-classroom.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@Controller('live-kit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LiveKitController {
    constructor(private readonly service: LiveClassroomService) {}

    @Get('token')
    async getToken(
        @CurrentUser() user: User,
        @Query('room') room: string,
    ) {
        // Basic UUID format check to prevent malformed requests
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!room || !uuidRegex.test(room)) {
            throw new BadRequestException('Valid UUID Room ID is required');
        }

        const isInstructor = user.role === UserRole.INSTRUCTOR || user.role === UserRole.TEACHER;
        const userName = `${user.firstName} ${user.lastName}`;
        const token = await this.service.generateToken(room, user.id, userName, isInstructor);
        return { token };
    }
}
