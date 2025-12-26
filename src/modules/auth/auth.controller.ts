import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterUserDto } from './dto/register-patient.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { RegisterPharmacistDto } from './dto/register-pharmacist.dto';
import { LoginDto } from './dto/login.dto';

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

    @Post("register/doctor")
    async registerDoctor(@Body() dto: RegisterDoctorDto) {
        return this.authService.registerDoctor(dto);
    }

    @Post("register/pharmacy")
    async registerPharmacist(@Body() dto: RegisterPharmacistDto) {
        return this.authService.registerPharmacist(dto);
    }

    @Post("login")
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
