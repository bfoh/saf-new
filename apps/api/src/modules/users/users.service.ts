import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import type { CEFRLevel } from '@saf/shared-types';
import { randomUUID } from 'crypto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface UpsertProfileDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: UserRole | string;
    cefrLevel?: string;
    avatarUrl?: string;
    visaStatus?: string;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email: email.toLowerCase() } });
    }

    async findById(id: string): Promise<User | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByIdOrFail(id: string): Promise<User> {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async create(dto: CreateUserDto): Promise<User> {
        const user = this.repo.create({
            id: randomUUID(),
            email: dto.email.toLowerCase(),
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: (dto.role as UserRole) ?? UserRole.STUDENT,
            cefrLevel: 'A1' as CEFRLevel,
            visaStatus: dto.visaStatus || null,
            isActive: true,
        });
        return this.repo.save(user);
    }

    /**
     * Upsert a user profile — used after Supabase sign-up/sign-in.
     * The id must be the Supabase auth.users UUID.
     */
    async upsert(dto: UpsertProfileDto): Promise<User> {
        const existing = await this.repo.findOne({ where: { id: dto.id } });

        if (existing) {
            if (dto.email) existing.email = dto.email.toLowerCase();
            if (dto.firstName) existing.firstName = dto.firstName;
            if (dto.lastName) existing.lastName = dto.lastName;
            if (dto.role) existing.role = dto.role as UserRole;
            if (dto.cefrLevel) existing.cefrLevel = dto.cefrLevel as CEFRLevel;
            if (dto.avatarUrl !== undefined) existing.avatarUrl = dto.avatarUrl;
            if (dto.visaStatus !== undefined) existing.visaStatus = dto.visaStatus;
            return this.repo.save(existing);
        }

        const user = new User();
        user.id = dto.id;
        user.email = dto.email.toLowerCase();
        user.firstName = dto.firstName || '';
        user.lastName = dto.lastName || '';
        user.role = (dto.role as UserRole) ?? UserRole.STUDENT;
        user.cefrLevel = ((dto.cefrLevel as CEFRLevel) ?? 'A1') as CEFRLevel;
        user.visaStatus = dto.visaStatus ?? null;
        user.isActive = true;
        return this.repo.save(user);
    }

    async findAll(role?: UserRole): Promise<User[]> {
        const query = this.repo.createQueryBuilder('user');
        if (role) {
            query.where('user.role = :role', { role });
        }
        return query.getMany();
    }

    async update(id: string, updateDto: UpdateUserDto): Promise<User> {
        const user = await this.findByIdOrFail(id);

        if (updateDto.email) user.email = updateDto.email.toLowerCase();
        if (updateDto.firstName) user.firstName = updateDto.firstName;
        if (updateDto.lastName) user.lastName = updateDto.lastName;
        if (updateDto.role) user.role = updateDto.role as UserRole;
        if (updateDto.cefrLevel) user.cefrLevel = updateDto.cefrLevel as CEFRLevel;
        if (updateDto.visaStatus !== undefined) user.visaStatus = updateDto.visaStatus;
        if (updateDto.isActive !== undefined) user.isActive = updateDto.isActive;

        return this.repo.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findByIdOrFail(id);
        await this.repo.remove(user);
    }
}
