"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const dashboard_service_1 = require("./src/modules/dashboard/dashboard.service");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const s = app.get(dashboard_service_1.DashboardService);
        console.log('Fetching progress for mock-student-id...');
        const res = await s.getStudentProgress('mock-student-id');
        console.log("Success:", res);
        await app.close();
    }
    catch (err) {
        console.error("DEBUG ERROR:", err.message, err.stack);
    }
}
bootstrap();
//# sourceMappingURL=test-progress-error.js.map