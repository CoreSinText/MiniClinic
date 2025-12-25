import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";
import { roleEnum } from "drizzle/drizzle.schema";


export class RegisterUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string


    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @IsIn(roleEnum.enumValues)
    role: typeof roleEnum.enumValues[number]
}