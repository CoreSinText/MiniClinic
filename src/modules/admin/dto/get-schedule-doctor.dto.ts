import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { IsMutuallyExclusiveWith } from "src/utils/decorators";

export class GetScheduleDoctorDto {
    @IsNumber()
    @ValidateIf(o => o.take !== undefined)
    @IsDefined({ message: "skip is required when take is present" })
    @Transform(({ value }) => parseInt(value))
    skip?: number;

    @IsNumber()
    @ValidateIf(o => o.skip !== undefined)
    @IsDefined({ message: "take is required when skip is present" })
    @Transform(({ value }) => parseInt(value))
    take?: number;

    @IsOptional()
    @IsString()
    @IsMutuallyExclusiveWith(['sort_by_start_time', 'sort_by_end_time'])
    search_by_doctor_id?: string

    @IsOptional()
    @IsBoolean()
    @IsMutuallyExclusiveWith(['sort_by_start_time', 'sort_by_end_time'])
    @Transform(({ value }) => value === 'true')
    search_by_active?: boolean

    @IsOptional()
    @IsEnum(["asc", "desc"])
    @IsMutuallyExclusiveWith(['search_by_doctor_id', 'search_by_active'])
    sort_by_start_time?: 'asc' | 'desc'

    @IsOptional()
    @IsEnum(["asc", "desc"])
    @IsMutuallyExclusiveWith(['search_by_doctor_id', 'search_by_active'])
    sort_by_end_time?: 'asc' | 'desc'
}