import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { CourseModuleEntity } from './course-module.entity';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';



@Entity('courses')
export class CourseEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({
        type: 'enum',
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        enumName: 'cefr_level',
    })
    cefr_level: CEFRLevel;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbnail_url: string;

    @Column({ type: 'boolean', default: false })
    is_published: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
    price: number;

    @OneToMany(() => CourseModuleEntity, (module) => module.course, { cascade: true })
    modules: CourseModuleEntity[];
}
