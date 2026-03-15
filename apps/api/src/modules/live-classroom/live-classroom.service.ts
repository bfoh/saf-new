import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessToken, TrackSource } from 'livekit-server-sdk';
import { ConfigService } from '@nestjs/config';
import { LiveSessionEntity } from './entities/live-session.entity';

@Injectable()
export class LiveClassroomService {
    constructor(
        @InjectRepository(LiveSessionEntity)
        private readonly sessionRepo: Repository<LiveSessionEntity>,
        private readonly configService: ConfigService,
    ) {}

    async generateToken(sessionId: string, userId: string, userName: string, isInstructor: boolean) {
        const apiKey = this.configService.get<string>('LIVEKIT_API_KEY');
        const apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');

        const at = new AccessToken(apiKey, apiSecret, {
            identity: userId,
            name: userName,
            metadata: JSON.stringify({ role: isInstructor ? 'instructor' : 'student' }),
        });

        at.addGrant({
            roomJoin: true,
            room: sessionId,
            canPublish: true,
            canSubscribe: true,
            roomAdmin: isInstructor,
            canPublishData: true,
            // Allow all participants (instructors and students) to share screens as part of the "functional" goal
            canPublishSources: [TrackSource.CAMERA, TrackSource.MICROPHONE, TrackSource.SCREEN_SHARE, TrackSource.SCREEN_SHARE_AUDIO],
        });

        return at.toJwt();
    }

    async createSession(hostId: string, classId: string, title: string): Promise<LiveSessionEntity> {
        const session = this.sessionRepo.create({
            host: { id: hostId } as any,
            class: { id: classId } as any,
            title,
            status: 'scheduled',
        });
        return this.sessionRepo.save(session);
    }

    async getSession(sessionId: string): Promise<LiveSessionEntity> {
        const session = await this.sessionRepo.findOne({
            where: { id: sessionId },
            relations: ['class', 'host'],
        });
        if (!session) throw new NotFoundException('Session not found');
        return session;
    }

    async startSession(sessionId: string, hostId: string, userRole?: string): Promise<LiveSessionEntity> {
        const session = await this.getSession(sessionId);
        
        // Allow if user is either the designated host OR is an admin/instructor
        const isAuthorizedHost = 
            session.host?.id === hostId || 
            userRole === 'admin' || 
            userRole === 'instructor';

        if (!isAuthorizedHost) {
            console.error(`[LiveClassroomService] Unauthorized start attempt: User ${hostId} (Role: ${userRole}) tried to start session ${sessionId} owned by ${session.host?.id}`);
            throw new ForbiddenException('Only the host or an authorized instructor can start the session');
        }

        if (session.status === 'live') return session;

        session.status = 'live';
        session.startedAt = new Date();
        return this.sessionRepo.save(session);
    }

    async endSession(sessionId: string, hostId: string): Promise<LiveSessionEntity> {
        const session = await this.getSession(sessionId);
        if (session.host?.id !== hostId) throw new ForbiddenException('Only the host can end the session');
        session.status = 'ended';
        session.endedAt = new Date();
        return this.sessionRepo.save(session);
    }

    async getActiveForClass(classId: string): Promise<LiveSessionEntity | null> {
        return this.sessionRepo.findOne({
            where: { class: { id: classId } as any, status: 'live' },
            relations: ['host'],
        });
    }

    async saveRecording(
        sessionId: string,
        hostId: string,
        recordingUrl: string,
        resourceId?: string,
    ): Promise<LiveSessionEntity> {
        const session = await this.getSession(sessionId);
        if (session.host?.id !== hostId) throw new ForbiddenException('Only the host can save the recording');
        session.recordingUrl = recordingUrl;
        if (resourceId) session.resourceId = resourceId;
        return this.sessionRepo.save(session);
    }
}
