import { IsDate, IsDateString, IsEmail, IsIn, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";
import { genderEnum } from "drizzle/drizzle.schema";


export class RegisterUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string


    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @IsString()
    @IsNotEmpty()
    @MinLength(16)
    national_id: string

    @IsString()
    @IsNotEmpty()
    phone_number: string


    @IsString()
    @IsNotEmpty()
    address: string

    @IsDateString()
    @IsNotEmpty()
    birth_date: Date

    @IsString()
    @IsNotEmpty()
    name: string

    @IsIn(genderEnum.enumValues)
    gender: typeof genderEnum.enumValues[number]
}