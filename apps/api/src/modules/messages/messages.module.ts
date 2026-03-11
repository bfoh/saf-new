import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, User]),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('SUPABASE_JWT_SECRET'),
            }),
        }),
    ],
    providers: [MessagesService, MessagesGateway],
    controllers: [MessagesController],
    exports: [MessagesService],
})
export class MessagesModule {}
