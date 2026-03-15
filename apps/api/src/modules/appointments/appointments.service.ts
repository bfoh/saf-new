import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './appointment.entity';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(AppointmentEntity)
        private repo: Repository<AppointmentEntity>,
    ) {}

    async create(dto: Partial<AppointmentEntity>): Promise<AppointmentEntity> {
        const appt = this.repo.create(dto);
        return this.repo.save(appt);
    }

    async findAll(): Promise<AppointmentEntity[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
}
