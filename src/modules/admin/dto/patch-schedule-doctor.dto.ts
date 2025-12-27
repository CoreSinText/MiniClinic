import { IsNumber, Min, Max, IsNotEmpty, IsString, Matches, IsBoolean, IsOptional } from "class-validator"

export class PatchScheduleDoctorDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(7)
    day_of_week: number

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, { message: "time must be in HH:mm or HH:mm:ss format", })
    start_time: string

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, { message: "time must be in HH:mm or HH:mm:ss format", })
    end_time: string

    @IsOptional()
    @IsBoolean()
    is_active: boolean
}