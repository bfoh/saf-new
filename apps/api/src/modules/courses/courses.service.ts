import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from './entities/course.entity';
import { CourseModuleEntity } from './entities/course-module.entity';
import { LessonEntity } from './entities/lesson.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(CourseEntity)
        private courseRepo: Repository<CourseEntity>,
        @InjectRepository(CourseModuleEntity)
        private moduleRepo: Repository<CourseModuleEntity>,
        @InjectRepository(LessonEntity)
        private lessonRepo: Repository<LessonEntity>,
    ) { }

    // ------------------------------------------------------------------------
    // COURSES
    // ------------------------------------------------------------------------
    async findAll(): Promise<CourseEntity[]> {
        return await this.courseRepo.find({
            relations: ['modules', 'modules.lessons'],
            order: { createdAt: 'DESC' } as any
        });
    }

    async findOne(id: string): Promise<CourseEntity> {
        const course = await this.courseRepo.findOne({
            where: { id } as any,
            relations: ['modules', 'modules.lessons'],
        });
        if (!course) throw new NotFoundException(`Course ${id} not found`);
        return course;
    }

    async create(dto: any): Promise<CourseEntity> {
        const course = this.courseRepo.create(dto as Partial<CourseEntity>);
        return await this.courseRepo.save(course);
    }

    async update(id: string, dto: any): Promise<CourseEntity> {
        await this.courseRepo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.courseRepo.delete(id);
    }

    // ------------------------------------------------------------------------
    // MODULES
    // ------------------------------------------------------------------------
    async addModule(courseId: string, dto: any): Promise<CourseModuleEntity> {
        const course = await this.findOne(courseId);
        const module = this.moduleRepo.create({ ...dto, course_id: course.id } as Partial<CourseModuleEntity>);
        return await this.moduleRepo.save(module);
    }

    async removeModule(moduleId: string): Promise<void> {
        await this.moduleRepo.delete(moduleId);
    }

    // ------------------------------------------------------------------------
    // LESSONS
    // ------------------------------------------------------------------------
    async addLesson(moduleId: string, dto: any): Promise<LessonEntity> {
        const module = await this.moduleRepo.findOneBy({ id: moduleId });
        if (!module) throw new NotFoundException('Module not found');
        const lesson = this.lessonRepo.create({ ...dto, module_id: module.id } as Partial<LessonEntity>);
        return await this.lessonRepo.save(lesson);
    }

    async removeLesson(lessonId: string): Promise<void> {
        await this.lessonRepo.delete(lessonId);
    }
}
