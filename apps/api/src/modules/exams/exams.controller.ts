import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
    constructor(private readonly examsService: ExamsService) { }

    // Admin endpoints
    @Get('admin')
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    findAllForAdmin() {
        return this.examsService.findAll(false);
    }

    @Get('submissions')
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    getSubmissions() {
        return this.examsService.getSubmissions();
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    create(@Body() createExamDto: any) {
        return this.examsService.create(createExamDto);
    }

    @Post(':id/sections')
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    addSection(@Param('id') id: string, @Body() sectionDto: any) {
        return this.examsService.addSection(id, sectionDto);
    }

    @Patch('submissions/:id/grade')
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    gradeSubmission(@Param('id') id: string, @Body() gradingDto: any) {
        return this.examsService.gradeSubmission(id, gradingDto);
    }

    // Student endpoints
    @Get()
    @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.TEACHER)
    findAllPublished() {
        return this.examsService.findAll(true);
    }

    @Get(':id')
    @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.TEACHER)
    findOne(@Param('id') id: string) {
        return this.examsService.findOne(id);
    }

    @Post(':id/submit')
    @Roles(UserRole.STUDENT)
    submitExam(@Request() req, @Param('id') id: string, @Body() submissionDto: { answers: any[] }) {
        const studentId = req.user.id;
        return this.examsService.submitExam(studentId, id, submissionDto.answers);
    }
}
