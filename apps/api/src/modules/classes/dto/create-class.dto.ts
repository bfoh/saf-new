import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ClassStatus } from '../entities/class.entity';

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    cefrLevel: string;

    @IsString()
    @IsOptional()
    startDate?: string;

    @IsString()
    @IsOptional()
    endDate?: string;

    @IsEnum(ClassStatus)
    @IsOptional()
    status?: ClassStatus;

    @IsUUID()
    @IsOptional()
    branchId?: string;

    @IsUUID()
    @IsOptional()
    teacherId?: string;
}
