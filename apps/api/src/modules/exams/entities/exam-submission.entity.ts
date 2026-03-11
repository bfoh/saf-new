import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { MockExamEntity } from './mock-exam.entity';
import { User } from '../../users/entities/user.entity';

@Entity('exam_submissions')
export class ExamSubmissionEntity extends BaseEntity {
    @ManyToOne(() => User)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @Column({ name: 'student_id' })
    studentId: string;

    @ManyToOne(() => MockExamEntity)
    @JoinColumn({ name: 'mock_exam_id' })
    mockExam: MockExamEntity;

    @Column({ name: 'mock_exam_id' })
    mockExamId: string;

    @Column({ name: 'score_lesen', type: 'int', nullable: true })
    scoreLesen: number;

    @Column({ name: 'score_horen', type: 'int', nullable: true })
    scoreHoren: number;

    @Column({ name: 'score_schreibung', type: 'int', nullable: true })
    scoreSchreibung: number;

    @Column({ name: 'score_sprechen', type: 'int', nullable: true })
    scoreSprechen: number;

    @Column({ name: 'teacher_feedback', type: 'text', nullable: true })
    teacherFeedback: string;

    @Column({ name: 'status', length: 50, nullable: true })
    status: string; // 'submitted', 'grading', 'graded'
}
