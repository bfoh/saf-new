import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProgressEntity } from './entities/student-progress.entity';
import { LessonCompletionEntity } from './entities/lesson-completion.entity';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        @InjectRepository(StudentProgressEntity)
        private readonly progressRepo: Repository<StudentProgressEntity>,
        @InjectRepository(LessonCompletionEntity)
        private readonly completionRepo: Repository<LessonCompletionEntity>,
    ) { }

    async getStudentProgress(studentId: string): Promise<StudentProgressEntity> {
        let progress: StudentProgressEntity | null = null;
        try {
            progress = await this.progressRepo.findOne({ where: { studentId } });
        } catch (err) {
            this.logger.warn(`Could not query progress for student ${studentId}: ${err.message}`);
        }

        // Auto-initialize if it doesn't exist
        if (!progress) {
            progress = this.progressRepo.create({
                studentId,
                xpPoints: 0,
                streakDays: 0,
                lastActiveDate: new Date(),
            });
            try {
                await this.progressRepo.save(progress);
            } catch (err) {
                this.logger.warn(`Could not persist progress for student ${studentId} (likely a MOCK user id). Returning in-memory progress.`);
            }
        }

        return progress;
    }

    async markLessonComplete(studentId: string, lessonId: string): Promise<{ xpAwarded: number, totalXp: number }> {
        // Check if already completed
        const existing = await this.completionRepo.findOne({
            where: { studentId, lessonId }
        });

        if (existing) {
            return { xpAwarded: 0, totalXp: (await this.getStudentProgress(studentId)).xpPoints };
        }

        // 1. Record completion
        const completion = this.completionRepo.create({
            studentId,
            lessonId,
        });
        await this.completionRepo.save(completion);

        // 2. Award XP (e.g., 50 XP per lesson)
        const xpToAward = 50;
        let progress = await this.getStudentProgress(studentId);

        // Simple streak logic (if last active date was yesterday, streak++)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActive = progress.lastActiveDate ? new Date(progress.lastActiveDate) : null;
        if (lastActive) lastActive.setHours(0, 0, 0, 0);

        const oneDay = 24 * 60 * 60 * 1000;

        if (!lastActive) {
            progress.streakDays = 1;
        } else if (today.getTime() - lastActive.getTime() === oneDay) {
            progress.streakDays += 1;
        } else if (today.getTime() - lastActive.getTime() > oneDay) {
            progress.streakDays = 1; // reset streak
        }

        progress.xpPoints += xpToAward;
        progress.lastActiveDate = new Date();

        await this.progressRepo.save(progress);

        this.logger.log(`Student ${studentId} marked lesson ${lessonId} as complete. Awarded ${xpToAward} XP.`);

        return {
            xpAwarded: xpToAward,
            totalXp: progress.xpPoints,
        };
    }
}
