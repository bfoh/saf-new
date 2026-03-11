import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseEntity } from './entities/course.entity';
import { CourseModuleEntity } from './entities/course-module.entity';
import { LessonEntity } from './entities/lesson.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        CourseEntity,
        CourseModuleEntity,
        LessonEntity
    ])],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule { }
