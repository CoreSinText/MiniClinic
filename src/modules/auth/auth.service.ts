import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user.repository';
import { RegisterUserDto } from './dto/register-patient.dto';
import { PatientRepository } from 'src/repositories/patient.repository';
import { AuthRegisterAdminResponse, AuthRegisterPatientResponse } from './auth.response';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly patientRepository: PatientRepository
    ) { }

    async registerAdmin(dto: RegisterAdminDto): Promise<AuthRegisterAdminResponse> {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (existingUser) throw new ConflictException('Email already registered');

        const register = await this.userRepository.create({ ...dto, role: 'ADMIN' });

        if (register) {
            return { user_id: register.id, email: register.email, role: register.role! }
        } else throw new InternalServerErrorException('Failed to register admin')
    }

    async registerPatient(dto: RegisterUserDto): Promise<AuthRegisterPatientResponse> {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (existingUser) throw new ConflictException('Email already registered');


        const { email, password } = dto
        const registerUser = await this.userRepository.create({ email, password, role: "PATIENT" });

        if (registerUser) {
            const { national_id, phone_number, address, birth_date, name, gender } = dto
            const registerPatient = await this.patientRepository.create({ national_id, phone: phone_number, address, birth_date, name, gender, user_id: registerUser.id });
            return { user_id: registerUser.id, email: registerUser.email, national_id, phone_number, address, birth_date: registerPatient.dob, name, gender, role: registerUser.role! }
        } else throw new InternalServerErrorException('Failed to register patient')
    }
}
