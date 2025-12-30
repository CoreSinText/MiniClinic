import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class PrescriptionItemDto {
    @IsString()
    medicine_id: string;

    @IsNumber()
    quantity: number;

    @IsString()
    instructions: string;
}

export class PostConsultationDto {

    @IsString()
    diagnosis: string;

    @IsString()
    symptoms: string;

    @IsString()
    @IsOptional()
    treatment: string;

    @IsString()
    @IsOptional()
    note: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PrescriptionItemDto)
    prescription_items: PrescriptionItemDto[];
}