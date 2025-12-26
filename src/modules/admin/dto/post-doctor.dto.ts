import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { genderEnum, specializationEnum } from "drizzle/drizzle.schema";

export class PostDoctorDto {
    @IsString()
    name: string;

    @IsString()
    @IsIn(genderEnum.enumValues)
    gender: typeof genderEnum.enumValues[number];

    @IsString()
    licance_number: string;

    @IsString()
    @IsIn(specializationEnum.enumValues)
    specialization: typeof specializationEnum.enumValues[number];

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string
}