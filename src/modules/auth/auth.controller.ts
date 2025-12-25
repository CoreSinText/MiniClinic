import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterUserDto } from './dto/register-patient.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post('register/admin')
    async registerAdmin(@Body() dto: RegisterAdminDto) {
        return this.authService.registerAdmin(dto);
    }

    @Post("register/patient")
    async registerUser(@Body() dto: RegisterUserDto) {
        return this.authService.registerPatient(dto);
    }
}
