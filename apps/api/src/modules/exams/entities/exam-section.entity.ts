import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { MockExamEntity } from './mock-exam.entity';
import type { GoetheModule } from '@saf/shared-types';

@Entity('exam_sections')
export class ExamSectionEntity extends BaseEntity {
    @ManyToOne(() => MockExamEntity, exam => exam.sections, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'mock_exam_id' })
    mockExam: MockExamEntity;

    @Column({ name: 'mock_exam_id' })
    mockExamId: string;

    @Column({
        type: 'enum',
        enum: ['hören', 'lesen', 'schreiben', 'sprechen'],
        enumName: 'goethe_module',
        name: 'module_type'
    })
    moduleType: GoetheModule;

    @Column({ type: 'jsonb' })
    content: any;

    @Column({ name: 'max_score', type: 'int', nullable: true })
    maxScore: number;
}
