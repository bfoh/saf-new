import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    /** GET /api/messages/users — all users the current user can message */
    @Public()
    @Get('users')
    async getUsers(@CurrentUser() user: User) {
        const id = user?.id || '00000000-0000-0000-0000-000000000001';
        return this.messagesService.getUsers(id);
    }

    /** GET /api/messages/conversations — all conversations for current user */
    @Public()
    @Get('conversations')
    async getConversations(@CurrentUser() user: User) {
        const id = user?.id || '00000000-0000-0000-0000-000000000001';
        return this.messagesService.getConversations(id);
    }

    /** GET /api/messages/thread/:userId — message history with a specific user */
    @Public()
    @Get('thread/:userId')
    async getThread(@CurrentUser() user: User, @Param('userId') otherId: string) {
        const id = user?.id || '00000000-0000-0000-0000-000000000001';
        return this.messagesService.getThread(id, otherId);
    }
}
