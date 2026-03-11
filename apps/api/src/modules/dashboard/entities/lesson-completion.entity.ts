import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { User } from '../../users/entities/user.entity';
// Assuming Lesson is not yet fully typed in the schema since it wasn't requested for phase 1-4 directly, but it exists in db.
// We just store lesson_id directly.

@Entity('lesson_completions')
export class LessonCompletionEntity extends BaseEntity {
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: User;

    @Column({ name: 'student_id' })
    studentId: string;

    @Column({ name: 'lesson_id' })
    lessonId: string;

    @Column({ name: 'completed_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    completedAt: Date;
}
