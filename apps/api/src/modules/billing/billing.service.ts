import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class BillingService {
    constructor(
        @InjectRepository(InvoiceEntity)
        private repo: Repository<InvoiceEntity>,
    ) { }

    async create(createDto: CreateInvoiceDto): Promise<InvoiceEntity> {
        const invoice = this.repo.create({
            student: { id: createDto.studentId } as any,
            cohortName: createDto.cohortName,
            amount: createDto.amount,
            status: createDto.status || 'Pending',
        });
        return this.repo.save(invoice);
    }

    async findAll(): Promise<InvoiceEntity[]> {
        return this.repo.find({ relations: ['student'] });
    }

    async findOne(id: string): Promise<InvoiceEntity> {
        const invoice = await this.repo.findOne({
            where: { id },
            relations: ['student'],
        });
        if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
        return invoice;
    }

    async update(id: string, updateDto: UpdateInvoiceDto): Promise<InvoiceEntity> {
        const invoice = await this.findOne(id);

        if (updateDto.amount !== undefined) invoice.amount = updateDto.amount;
        if (updateDto.cohortName) invoice.cohortName = updateDto.cohortName;
        if (updateDto.status) invoice.status = updateDto.status;

        return this.repo.save(invoice);
    }

    async remove(id: string): Promise<void> {
        const invoice = await this.findOne(id);
        await this.repo.remove(invoice);
    }
}
