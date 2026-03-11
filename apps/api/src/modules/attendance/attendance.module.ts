import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceRecordEntity } from './entities/attendance-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecordEntity])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule { }
