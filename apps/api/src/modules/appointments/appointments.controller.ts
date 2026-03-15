import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly service: AppointmentsService) {}

    /** Called by the VAPI voice/text agent when a visitor books a consultation */
    @Post()
    @Public()
    create(@Body() body: any) {
        return this.service.create({
            name: body.name,
            email: body.email,
            phone: body.phone,
            course: body.course,
            preferredDate: body.preferred_date ?? body.preferredDate,
            notes: body.notes,
            source: body.source ?? 'voice_agent',
        });
    }

    /** Admin-only: view all booked appointments */
    @Get()
    findAll() {
        return this.service.findAll();
    }
}
