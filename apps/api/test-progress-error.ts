import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DashboardService } from './src/modules/dashboard/dashboard.service';

async function bootstrap() {
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        const s = app.get(DashboardService);
        console.log('Fetching progress for mock-student-id...');
        const res = await s.getStudentProgress('mock-student-id');
        console.log("Success:", res);
        await app.close();
    } catch (err) {
        console.error("DEBUG ERROR:", (err as Error).message, (err as Error).stack);
    }
}
bootstrap();
