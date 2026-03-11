import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { MockExamEntity } from './entities/mock-exam.entity';
import { ExamSectionEntity } from './entities/exam-section.entity';
import { ExamSubmissionEntity } from './entities/exam-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MockExamEntity, ExamSectionEntity, ExamSubmissionEntity])],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule { }
