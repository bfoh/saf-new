import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('appointments')
export class AppointmentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 50, nullable: true })
    phone: string;

    @Column({ length: 255, nullable: true })
    course: string;

    @Column({ name: 'preferred_date', length: 255, nullable: true })
    preferredDate: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ length: 50, default: 'voice_agent' })
    source: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}
