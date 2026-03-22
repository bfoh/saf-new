"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const courses_service_1 = require("./src/modules/courses/courses.service");
async function bootstrap() {
    console.log("Starting script...");
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        console.log("App created.");
        const coursesService = app.get(courses_service_1.CoursesService);
        const courses = await coursesService.findAll();
        console.log("Found courses:", courses.length);
        await app.close();
    }
    catch (err) {
        console.error("TYPEORM ERROR:", err);
    }
}
bootstrap();
//# sourceMappingURL=test-typeorm.js.map