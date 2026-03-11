import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    /** Save a new message and return it with sender/receiver populated */
    async save(senderId: string, receiverId: string, content: string): Promise<Message> {
        const msg = this.messageRepo.create({ senderId, receiverId, content });
        const saved = await this.messageRepo.save(msg);
        return this.messageRepo.findOne({
            where: { id: saved.id },
            relations: ['sender', 'receiver'],
        }) as Promise<Message>;
    }

    /**
     * Get all conversations for a user.
     * Returns one entry per unique counterpart, with last message + unread count.
     */
    async getConversations(userId: string): Promise<any[]> {
        // Get all distinct counterpart IDs
        const sent = await this.messageRepo
            .createQueryBuilder('m')
            .select('DISTINCT m.receiver_id', 'otherId')
            .where('m.sender_id = :userId', { userId })
            .getRawMany();

        const received = await this.messageRepo
            .createQueryBuilder('m')
            .select('DISTINCT m.sender_id', 'otherId')
            .where('m.receiver_id = :userId', { userId })
            .getRawMany();

        const otherIds = Array.from(
            new Set([...sent.map(r => r.otherId), ...received.map(r => r.otherId)])
        ).filter(id => id && id !== userId);

        if (otherIds.length === 0) return [];

        const conversations = await Promise.all(
            otherIds.map(async (otherId) => {
                const [lastMsg] = await this.messageRepo.find({
                    where: [
                        { senderId: userId, receiverId: otherId },
                        { senderId: otherId, receiverId: userId },
                    ],
                    relations: ['sender', 'receiver'],
                    order: { createdAt: 'DESC' },
                    take: 1,
                });

                const unreadCount = await this.messageRepo.count({
                    where: { senderId: otherId, receiverId: userId, isRead: false },
                });

                const other = await this.userRepo.findOne({ where: { id: otherId } });

                return {
                    otherId,
                    otherUser: other,
                    lastMessage: lastMsg,
                    unreadCount,
                };
            })
        );

        // Sort by most recent message
        return conversations
            .filter(c => c.lastMessage)
            .sort((a, b) =>
                new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
            );
    }

    /** Get message thread between two users, newest last */
    async getThread(userAId: string, userBId: string, limit = 50): Promise<Message[]> {
        return this.messageRepo.find({
            where: [
                { senderId: userAId, receiverId: userBId },
                { senderId: userBId, receiverId: userAId },
            ],
            relations: ['sender', 'receiver'],
            order: { createdAt: 'ASC' },
            take: limit,
        });
    }

    /** Mark all messages from senderId to receiverId as read */
    async markRead(receiverId: string, senderId: string): Promise<void> {
        await this.messageRepo.update(
            { senderId, receiverId, isRead: false },
            { isRead: true },
        );
    }

    /** Get all users except the current user for the "New Conversation" picker */
    async getUsers(currentUserId: string): Promise<User[]> {
        return this.userRepo.find({
            where: { id: Not(currentUserId), isActive: true },
            order: { firstName: 'ASC' },
        });
    }
}
