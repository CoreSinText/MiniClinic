import { IsBoolean, IsNotEmpty, IsNumber, IsString, Matches, Max, Min } from "class-validator";

export class PostScheduleDoctorDto {

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(7)
    day_of_week: number

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, { message: "time must be in HH:mm or HH:mm:ss format", })
    start_time: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, { message: "time must be in HH:mm or HH:mm:ss format", })
    end_time: string

    @IsNotEmpty()
    @IsString()
    doctor_id: string

    @IsBoolean()
    is_active: boolean

}