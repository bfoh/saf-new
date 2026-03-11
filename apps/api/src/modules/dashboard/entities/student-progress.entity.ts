import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('student_progress')
export class StudentProgressEntity {
    @PrimaryColumn({ name: 'student_id' })
    studentId: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: User;

    @Column({ name: 'xp_points', default: 0 })
    xpPoints: number;

    @Column({ name: 'streak_days', default: 0 })
    streakDays: number;

    @Column({ name: 'last_active_date', type: 'date', nullable: true })
    lastActiveDate: Date;

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
