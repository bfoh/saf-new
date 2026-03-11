import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StudentProgressEntity } from './entities/student-progress.entity';
import { LessonCompletionEntity } from './entities/lesson-completion.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentProgressEntity, LessonCompletionEntity]),
        UsersModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
