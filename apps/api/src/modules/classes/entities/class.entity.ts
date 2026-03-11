import {
    Entity,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
import type { CEFRLevel } from '@saf/shared-types';

export enum ClassStatus {
    ENROLLING = 'enrolling',
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

@Entity('classes')
export class ClassEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({
        name: 'cefr_level',
        type: 'enum',
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        enumName: 'cefr_level',
    })
    cefrLevel: CEFRLevel;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    startDate: string;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate: string;

    @Column({
        type: 'varchar',
        length: 50,
        default: ClassStatus.ENROLLING,
    })
    status: ClassStatus;

    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'teacher_id' })
    teacher: User;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'class_enrollments',
        joinColumn: { name: 'class_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'student_id', referencedColumnName: 'id' },
    })
    students: User[];
}
