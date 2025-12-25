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

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository,
        private readonly patientRepository: PatientRepository
    ) { }

    async registerAdmin(dto: RegisterAdminDto) {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (existingUser) throw new ConflictException('Email already registered');

        return this.userRepository.create({ ...dto, role: 'ADMIN' });
    }

    async registerPatient(dto: RegisterUserDto) {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (existingUser) throw new ConflictException('Email already registered');


        const { email, password } = dto
        const register = await this.userRepository.create({ email, password, role: "PATIENT" });

        if (register) {
            const { national_id, phone_number, address, birth_date, name, gender } = dto
            return this.patientRepository.create({ national_id, phone: phone_number, address, birth_date, name, gender, user_id: (await register).id });
        } else throw new InternalServerErrorException('Failed to register patient')
    }
}
