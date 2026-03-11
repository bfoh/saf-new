import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ClassEntity } from '../../classes/entities/class.entity';
import type { CEFRLevel } from '@saf/shared-types';

export enum UserRole {
    STUDENT = 'student',
    TEACHER = 'teacher',
    INSTRUCTOR = 'instructor',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
}

@Entity('profiles')
export class User {
    // UUID provided by Supabase Auth — never auto-generated
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'first_name', length: 100, default: '' })
    firstName: string;

    @Column({ name: 'last_name', length: 100, default: '' })
    lastName: string;

    @Column({ name: 'avatar_url', type: 'text', nullable: true })
    avatarUrl: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        enumName: 'user_role',
        default: UserRole.STUDENT,
    })
    role: UserRole;

    @Column({
        name: 'cefr_level',
        type: 'enum',
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        enumName: 'cefr_level',
        default: 'A1',
    })
    cefrLevel: CEFRLevel;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'visa_status', type: 'text', nullable: true })
    visaStatus: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @OneToMany(() => ClassEntity, (cls: ClassEntity) => cls.teacher)
    classesTaught: ClassEntity[];
}
