import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockExamEntity } from './entities/mock-exam.entity';
import { ExamSectionEntity } from './entities/exam-section.entity';
import { ExamSubmissionEntity } from './entities/exam-submission.entity';

@Injectable()
export class ExamsService {
    constructor(
        @InjectRepository(MockExamEntity)
        private mockExamRepo: Repository<MockExamEntity>,
        @InjectRepository(ExamSectionEntity)
        private examSectionRepo: Repository<ExamSectionEntity>,
        @InjectRepository(ExamSubmissionEntity)
        private examSubmissionRepo: Repository<ExamSubmissionEntity>,
    ) { }

    async findAll(publishedOnly: boolean = false) {
        if (publishedOnly) {
            return this.mockExamRepo.find({ where: { isPublished: true }, relations: ['sections'] });
        }
        return this.mockExamRepo.find({ relations: ['sections'] });
    }

    async findOne(id: string) {
        const exam = await this.mockExamRepo.findOne({
            where: { id },
            relations: ['sections'],
        });
        if (!exam) throw new NotFoundException('Exam not found');
        return exam;
    }

    async create(dto: any) {
        const exam = this.mockExamRepo.create(dto);
        return this.mockExamRepo.save(exam);
    }

    async addSection(examId: string, dto: any) {
        const exam = await this.findOne(examId);
        const section = this.examSectionRepo.create({
            ...dto,
            mockExam: exam,
        });
        return this.examSectionRepo.save(section);
    }

    async submitExam(studentId: string, examId: string, answers: any[]) {
        const exam = await this.findOne(examId);

        let scoreLesen = 0;
        let scoreHoren = 0;

        // Grading Logic for Objective Sections
        for (const answer of answers) {
            const section = exam.sections.find((s) => s.id === answer.sectionId);
            if (!section) continue;

            if (section.moduleType === 'lesen' || section.moduleType === 'hören') {
                const questions = section.content?.questions || [];
                let sectionScore = 0;

                for (const question of questions) {
                    const studentAnswer = answer.data[question.id];
                    if (studentAnswer && studentAnswer === question.correctAnswer) {
                        sectionScore += question.points || 1;
                    }
                }

                if (section.moduleType === 'lesen') scoreLesen += sectionScore;
                if (section.moduleType === 'hören') scoreHoren += sectionScore;
            }
        }

        const submission = this.examSubmissionRepo.create({
            studentId,
            mockExamId: exam.id,
            scoreLesen,
            scoreHoren,
            scoreSchreibung: null,
            scoreSprechen: null,
            status: 'submitted',
        } as any);

        return this.examSubmissionRepo.save(submission);
    }

    async getSubmissions() {
        return this.examSubmissionRepo.find({
            relations: ['student', 'mockExam'],
        });
    }

    async gradeSubmission(submissionId: string, dto: { scoreSchreibung?: number; scoreSprechen?: number; teacherFeedback?: string }) {
        const submission = await this.examSubmissionRepo.findOne({ where: { id: submissionId } });
        if (!submission) throw new NotFoundException('Submission not found');

        if (dto.scoreSchreibung !== undefined) submission.scoreSchreibung = dto.scoreSchreibung;
        if (dto.scoreSprechen !== undefined) submission.scoreSprechen = dto.scoreSprechen;
        if (dto.teacherFeedback) submission.teacherFeedback = dto.teacherFeedback;

        // If all 4 sections are graded (i.e. not null)
        if (submission.scoreLesen !== null && submission.scoreHoren !== null && submission.scoreSchreibung !== null && submission.scoreSprechen !== null) {
            submission.status = 'graded';
        } else {
            submission.status = 'grading';
        }

        return this.examSubmissionRepo.save(submission);
    }
}
