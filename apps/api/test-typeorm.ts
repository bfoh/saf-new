import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { CoursesService } from './src/modules/courses/courses.service';

async function bootstrap() {
    console.log("Starting script...");
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        console.log("App created.");
        const coursesService = app.get(CoursesService);

        const courses = await coursesService.findAll();
        console.log("Found courses:", courses.length);
        await app.close();
    } catch (err) {
        console.error("TYPEORM ERROR:", err);
    }
}
bootstrap();
