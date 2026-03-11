import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('invoices')
export class InvoiceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, undefined, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: User;

    @Column({ name: 'cohort_name', length: 255 })
    cohortName: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ name: 'date_issued', type: 'date', default: () => 'CURRENT_DATE' })
    dateIssued: string;

    @Column({ length: 50, default: 'Pending' })
    status: string;
}
