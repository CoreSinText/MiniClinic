import { IsEmail, IsIn, IsOptional, isString, IsString } from "class-validator";
import { genderEnum, specializationEnum } from "drizzle/drizzle.schema";

export class PatchDoctorDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    @IsIn(genderEnum.enumValues)
    gender: typeof genderEnum.enumValues[number];

    @IsString()
    @IsOptional()
    licance_number: string;

    @IsString()
    @IsOptional()
    @IsIn(specializationEnum.enumValues)
    specialization: typeof specializationEnum.enumValues[number];


    @IsOptional()
    @IsEmail()
    email: string

}