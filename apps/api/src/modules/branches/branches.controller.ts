import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/create-branch.dto';

import { Public } from '../../common/decorators/public.decorator';

// Optional: you can uncomment @UseGuards(JwtAuthGuard) to restrict these
// APIs to authenticated admins only. Leaving it open for early dev testing.
// @UseGuards(JwtAuthGuard)
@Public()
@Controller('branches')
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) { }

    @Post()
    create(@Body() createBranchDto: CreateBranchDto) {
        return this.branchesService.create(createBranchDto);
    }

    @Get()
    findAll() {
        return this.branchesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.branchesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
        return this.branchesService.update(id, updateBranchDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.branchesService.remove(id);
    }
}
