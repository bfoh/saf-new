import { Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from './course.entity';
import { LessonEntity } from './lesson.entity';

@Entity('course_modules')
export class CourseModuleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'course_id' })
    course_id: string;

    @ManyToOne(() => CourseEntity, (course) => course.modules, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: CourseEntity;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'int' })
    order_index: number;

    @OneToMany(() => LessonEntity, (lesson) => lesson.module, { cascade: true })
    lessons: LessonEntity[];
}
