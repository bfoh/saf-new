import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Post()
    create(@Body() createDto: CreateInvoiceDto) {
        return this.billingService.create(createDto);
    }

    @Get()
    findAll() {
        return this.billingService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.billingService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateInvoiceDto) {
        return this.billingService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.billingService.remove(id);
    }
}
