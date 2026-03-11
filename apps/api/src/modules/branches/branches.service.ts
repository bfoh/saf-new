import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto, UpdateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
    constructor(
        @InjectRepository(Branch)
        private readonly branchesRepository: Repository<Branch>,
    ) { }

    async findAll(): Promise<Branch[]> {
        return this.branchesRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findOne(id: string): Promise<Branch> {
        const branch = await this.branchesRepository.findOne({ where: { id } });
        if (!branch) {
            throw new NotFoundException(`Branch with ID "${id}" not found`);
        }
        return branch;
    }

    async create(createBranchDto: CreateBranchDto): Promise<Branch> {
        const branch = this.branchesRepository.create(createBranchDto);
        return this.branchesRepository.save(branch);
    }

    async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
        const branch = await this.findOne(id);
        this.branchesRepository.merge(branch, updateBranchDto);
        return this.branchesRepository.save(branch);
    }

    async remove(id: string): Promise<void> {
        const branch = await this.findOne(id);
        await this.branchesRepository.remove(branch);
    }
}
