import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecordEntity } from './entities/attendance-record.entity';

@Injectable()
export class AttendanceService {
    private readonly logger = new Logger(AttendanceService.name);

    constructor(
        @InjectRepository(AttendanceRecordEntity)
        private readonly attendanceRepo: Repository<AttendanceRecordEntity>
    ) { }

    async markAttendance(classId: string, records: { studentId: string, isPresent: boolean }[]) {
        this.logger.log(`Marking attendance for class ${classId}`);

        const today = new Date();
        // In PostgreSQL, default times might drift if we don't normalize to just the date,
        // but creating new records handles the basic setup.

        const entites = records.map(r => this.attendanceRepo.create({
            classId: classId,
            studentId: r.studentId,
            isPresent: r.isPresent,
            date: today
        }));

        await this.attendanceRepo.save(entites);
        return { success: true, count: entites.length };
    }

    async getAttendanceForClass(classId: string, dateStr?: string) {
        // Find all records for a class
        const query = this.attendanceRepo.createQueryBuilder('a')
            .where('a.class_id = :classId', { classId })
            .leftJoinAndSelect('a.student', 'student');

        if (dateStr) {
            query.andWhere('a.date = :date', { date: dateStr })
        }

        return query.getMany();
    }
}
