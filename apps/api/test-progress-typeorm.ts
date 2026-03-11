import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DashboardService } from './src/modules/dashboard/dashboard.service';

async function bootstrap() {
    console.log("Starting script...");
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        console.log("App created.");
        const dashboardService = app.get(DashboardService);

        const progress = await dashboardService.getStudentProgress('mock-student-id');
        console.log("Progress:", progress);
        await app.close();
    } catch (err) {
        console.error("TYPEORM ERROR:", err);
    }
}
bootstrap();
