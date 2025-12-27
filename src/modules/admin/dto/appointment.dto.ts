import { IsDateString, IsDefined, IsEnum, IsInt, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { IsMutuallyExclusiveWith } from "src/utils/decorators";

export class GetAppointmentsQueryDto {
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    @ValidateIf(o => o.skip !== undefined)
    @IsDefined({ message: "If 'skip' is provided, 'take' is also required." })
    take?: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    @ValidateIf(o => o.take !== undefined)
    @IsDefined({ message: "If 'take' is provided, 'skip' is also required." })
    skip?: number;

    @IsOptional()
    @IsString()
    doctor_id?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsEnum(['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    status?: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export class PostAppointmentDto {
    @IsUUID()
    patient_id: string;

    @IsUUID()
    doctor_id: string;

    @IsDateString()
    date: string; // YYYY-MM-DD
}

export class PatchAppointmentDto {
    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsEnum(['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    status?: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
