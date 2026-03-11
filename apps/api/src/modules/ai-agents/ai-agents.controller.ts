import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('ai-agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiAgentsController {
    constructor(private readonly aiAgentsService: AiAgentsService) { }

    @Post('horen/generate')
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    async generateAudio(@Body() payload: { text: string; voiceId?: string }) {
        return this.aiAgentsService.generateHorenAudio(payload.text, payload.voiceId);
    }

    @Post('sprechen/initiate')
    @Roles(UserRole.STUDENT)
    async startSprechenTest(@Request() req, @Body() payload: { cefrLevel: string; context: string }) {
        return this.aiAgentsService.initiateSprechenSession(req.user.id, payload.cefrLevel, payload.context);
    }
}
