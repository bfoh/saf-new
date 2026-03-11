import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import type { CEFRLevel } from '@saf/shared-types';
import { ExamSectionEntity } from './exam-section.entity';

@Entity('mock_exams')
export class MockExamEntity extends BaseEntity {
    @Column({ length: 255 })
    title: string;

    @Column({
        type: 'enum',
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        enumName: 'cefr_level',
        name: 'cefr_level'
    })
    cefrLevel: CEFRLevel;

    @Column({ name: 'duration_mins', type: 'int', nullable: true })
    durationMins: number;

    @Column({ name: 'is_published', default: false })
    isPublished: boolean;

    @OneToMany(() => ExamSectionEntity, section => section.mockExam)
    sections: ExamSectionEntity[];
}
