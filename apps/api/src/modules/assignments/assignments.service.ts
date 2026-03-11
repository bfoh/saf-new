import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentEntity } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
    constructor(
        @InjectRepository(AssignmentEntity)
        private assignmentRepo: Repository<AssignmentEntity>,
    ) { }

    async findAll(): Promise<AssignmentEntity[]> {
        return await this.assignmentRepo.find({
            relations: ['course'],
            order: { due_date: 'DESC' } as any
        });
    }

    async findOne(id: string): Promise<AssignmentEntity> {
        const assignment = await this.assignmentRepo.findOne({
            where: { id } as any,
            relations: ['course'],
        });
        if (!assignment) throw new NotFoundException(`Assignment ${id} not found`);
        return assignment;
    }

    async create(dto: any): Promise<AssignmentEntity> {
        const assignment = this.assignmentRepo.create(dto as Partial<AssignmentEntity>);
        return await this.assignmentRepo.save(assignment);
    }

    async update(id: string, dto: any): Promise<AssignmentEntity> {
        await this.assignmentRepo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.assignmentRepo.delete(id);
    }
}
