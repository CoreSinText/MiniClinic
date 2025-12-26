
import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";
import { genderEnum } from "drizzle/drizzle.schema";

export class RegisterPharmacistDto {

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
    license_number: string;

    @IsIn(genderEnum.enumValues)
    @IsNotEmpty()
    gender: typeof genderEnum.enumValues[number];
}
