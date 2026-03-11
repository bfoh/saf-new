import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassEntity, ClassStatus } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CEFRLevel } from '@saf/shared-types';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(ClassEntity)
        private repo: Repository<ClassEntity>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async create(createDto: CreateClassDto): Promise<ClassEntity> {
        const newClass = this.repo.create({
            name: createDto.name,
            cefrLevel: createDto.cefrLevel as CEFRLevel,
            startDate: createDto.startDate,
            endDate: createDto.endDate,
            status: createDto.status || ClassStatus.ENROLLING,
            branch: createDto.branchId ? { id: createDto.branchId } as any : null,
            teacher: createDto.teacherId ? { id: createDto.teacherId } as any : null,
        });

        return this.repo.save(newClass);
    }

    async findAll(): Promise<ClassEntity[]> {
        return this.repo.find({
            relations: ['branch', 'teacher'],
        });
    }

    async findOne(id: string): Promise<ClassEntity> {
        const cls = await this.repo.findOne({
            where: { id },
            relations: ['branch', 'teacher', 'students'],
        });
        if (!cls) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        return cls;
    }

    async update(id: string, updateDto: UpdateClassDto): Promise<ClassEntity> {
        const cls = await this.findOne(id);

        if (updateDto.name) cls.name = updateDto.name;
        if (updateDto.cefrLevel) cls.cefrLevel = updateDto.cefrLevel as CEFRLevel;
        if (updateDto.startDate !== undefined) cls.startDate = updateDto.startDate;
        if (updateDto.endDate !== undefined) cls.endDate = updateDto.endDate;
        if (updateDto.status) cls.status = updateDto.status;

        if (updateDto.branchId !== undefined) {
            cls.branch = updateDto.branchId ? { id: updateDto.branchId } as any : null;
        }

        if (updateDto.teacherId !== undefined) {
            cls.teacher = updateDto.teacherId ? { id: updateDto.teacherId } as any : null;
        }

        return this.repo.save(cls);
    }

    async remove(id: string): Promise<void> {
        const cls = await this.findOne(id);
        await this.repo.remove(cls);
    }

    async enrollStudent(classId: string, studentId: string): Promise<ClassEntity> {
        const cls = await this.findOne(classId);
        const student = await this.userRepo.findOne({ where: { id: studentId } });
        if (!student) throw new NotFoundException(`Student ${studentId} not found`);

        const alreadyEnrolled = cls.students?.some(s => s.id === studentId);
        if (alreadyEnrolled) throw new BadRequestException('Student is already enrolled in this class');

        cls.students = [...(cls.students || []), student];
        return this.repo.save(cls);
    }

    async removeStudent(classId: string, studentId: string): Promise<ClassEntity> {
        const cls = await this.findOne(classId);
        cls.students = (cls.students || []).filter(s => s.id !== studentId);
        return this.repo.save(cls);
    }
}
