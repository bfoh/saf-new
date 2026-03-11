import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CourseModuleEntity } from './course-module.entity';

@Entity('lessons')
export class LessonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'module_id' })
    module_id: string;

    @ManyToOne(() => CourseModuleEntity, (module) => module.lessons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'module_id' })
    module: CourseModuleEntity;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 50 })
    content_type: 'video' | 'reading' | 'speaking' | 'listening';

    @Column({ type: 'jsonb', nullable: true })
    content_data: any;

    @Column({ type: 'int' })
    order_index: number;
}
