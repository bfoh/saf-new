import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @Get()
    findAll() {
        return this.assignmentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.assignmentsService.findOne(id);
    }

    @Post()
    create(@Body() createAssignmentDto: any) {
        return this.assignmentsService.create(createAssignmentDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAssignmentDto: any) {
        return this.assignmentsService.update(id, updateAssignmentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.assignmentsService.remove(id);
    }
}
