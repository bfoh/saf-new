import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';

interface AuthPayload {
    sub: string;
    email: string;
}

@WebSocketGateway({
    namespace: '/messages',
    cors: {
        origin: process.env.WEB_URL || 'http://localhost:3000',
        credentials: true,
    },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly connectedUsers = new Map<string, string>(); // socketId → userId

    constructor(
        private readonly messagesService: MessagesService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async handleConnection(client: Socket) {
        try {
            const token =
                (client.handshake.auth?.token as string) ||
                (client.handshake.query?.token as string);

            if (!token) {
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify<AuthPayload>(token, {
                secret: this.configService.get<string>('SUPABASE_JWT_SECRET'),
            });

            const userId = payload.sub;
            client.data.userId = userId;
            this.connectedUsers.set(client.id, userId);

            // Join a personal room so messages can be targeted
            await client.join(userId);
        } catch {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.connectedUsers.delete(client.id);
    }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { receiverId: string; content: string },
    ) {
        const senderId = client.data.userId as string;
        if (!senderId || !data.receiverId || !data.content?.trim()) return;

        const message = await this.messagesService.save(
            senderId,
            data.receiverId,
            data.content.trim(),
        );

        const payload = {
            id: message.id,
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
            sender: {
                id: message.sender?.id,
                firstName: message.sender?.firstName,
                lastName: message.sender?.lastName,
                email: message.sender?.email,
            },
        };

        // Emit to receiver's room
        this.server.to(data.receiverId).emit('new_message', payload);

        // Echo back to sender (confirmation)
        client.emit('message_sent', payload);
    }

    @SubscribeMessage('mark_read')
    async handleMarkRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { senderId: string },
    ) {
        const receiverId = client.data.userId as string;
        if (!receiverId || !data.senderId) return;

        await this.messagesService.markRead(receiverId, data.senderId);

        // Notify the sender that their messages were read
        this.server.to(data.senderId).emit('messages_read', { by: receiverId });
    }

    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { receiverId: string; isTyping: boolean },
    ) {
        const senderId = client.data.userId as string;
        if (!senderId || !data.receiverId) return;

        this.server.to(data.receiverId).emit('user_typing', {
            senderId,
            isTyping: data.isTyping,
        });
    }
}
