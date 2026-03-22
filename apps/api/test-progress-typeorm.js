"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const dashboard_service_1 = require("./src/modules/dashboard/dashboard.service");
async function bootstrap() {
    console.log("Starting script...");
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        console.log("App created.");
        const dashboardService = app.get(dashboard_service_1.DashboardService);
        const progress = await dashboardService.getStudentProgress('mock-student-id');
        console.log("Progress:", progress);
        await app.close();
    }
    catch (err) {
        console.error("TYPEORM ERROR:", err);
    }
}
bootstrap();
//# sourceMappingURL=test-progress-typeorm.js.map