import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateInvoiceDto {
    @IsUUID()
    @IsNotEmpty()
    studentId: string;

    @IsString()
    @IsNotEmpty()
    cohortName: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsOptional()
    status?: string;
}
