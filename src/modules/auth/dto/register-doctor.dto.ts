import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";
import { genderEnum, specializationEnum } from "drizzle/drizzle.schema";

export class RegisterDoctorDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;


    @IsString()
    @IsNotEmpty()
    @MinLength(15)
    licance_number: string;

    @IsIn(genderEnum.enumValues)
    @IsNotEmpty()
    gender: typeof genderEnum.enumValues[number];

    @IsIn(specializationEnum.enumValues)
    @IsNotEmpty()
    specialization: typeof specializationEnum.enumValues[number];
}