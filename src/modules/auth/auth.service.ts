import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UserRepository } from '../../repositories/user.repository';
import { RegisterUserDto } from './dto/register-patient.dto';
import { PatientRepository } from 'src/repositories/patient.repository';
import { DoctorRepository } from 'src/repositories/doctor.repository';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { RegisterPharmacistDto } from './dto/register-pharmacist.dto';
import { PharmacistRepository } from 'src/repositories/pharmacist.repository';
import { AuthLoginResponse, AuthRegisterAdminResponse, AuthRegisterDoctorResponse, AuthRegisterPatientResponse, AuthRegisterPharmacistResponse } from './auth.response';
import { LoginDto } from './dto/login.dto';
import { JwtToken } from 'src/utils/JwtToken';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly patientRepository: PatientRepository,
        private readonly doctorRepository: DoctorRepository,
        private readonly pharmacistRepository: PharmacistRepository,
    ) { }

    async registerAdmin(dto: RegisterAdminDto): Promise<AuthRegisterAdminResponse> {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (existingUser) throw new ConflictException('Email already registered');

        const register = await this.userRepository.create({ ...dto, role: 'ADMIN' });

        if (register) {
            return { data: { user_id: register.id, email: register.email, role: register.role! } }
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
            return { data: { user_id: registerUser.id, email: registerUser.email, national_id, phone_number, address, birth_date: registerPatient.dob, name, gender, role: registerUser.role! } }
        } else throw new InternalServerErrorException('Failed to register patient')
    }

    async registerDoctor(dto: RegisterDoctorDto): Promise<AuthRegisterDoctorResponse> {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (existingUser) throw new ConflictException('Email already registered');

        const { email, password } = dto
        const registerUser = await this.userRepository.create({ email, password, role: "DOCTOR" });

        if (registerUser) {
            const { name, gender, licance_number, specialization } = dto
            const registerDoctor = await this.doctorRepository.create({ name, gender, licance_number, specialization, user_id: registerUser.id });
            return { data: { user_id: registerUser.id, email: registerUser.email, licance_number: registerDoctor.licenseNumber!, specialization: registerDoctor.specialization, name: registerDoctor.name, gender, role: registerUser.role! } }
        } else throw new InternalServerErrorException('Failed to register doctor')
    }

    async registerPharmacist(dto: RegisterPharmacistDto): Promise<AuthRegisterPharmacistResponse> {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (existingUser) throw new ConflictException('Email already registered');

        const { email, password } = dto
        const registerUser = await this.userRepository.create({ email, password, role: "PHARMACIST" });

        if (registerUser) {
            const { name, gender, license_number } = dto
            const registerPharmacist = await this.pharmacistRepository.create({ name, gender, licenseNumber: license_number, userId: registerUser.id });
            return { data: { user_id: registerUser.id, email: registerUser.email, license_number: registerPharmacist.licenseNumber!, name, gender, role: registerUser.role! } }
        } else throw new InternalServerErrorException('Failed to register pharmacist')
    }

    async login(dto: LoginDto): Promise<AuthLoginResponse> {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (!existingUser) throw new BadRequestException('Email or password is incorrect');
        const user = await this.userRepository.verifyEmailWithPassword(dto.email, dto.password);
        if (!user) throw new BadRequestException('Email or password is incorrect');

        let name = '';
        if (user.role === 'PATIENT') {
            const patient = await this.patientRepository.findPatientByUserId(user.id);
            name = patient?.name || '';
        } else if (user.role === 'DOCTOR') {
            const doctor = await this.doctorRepository.findById(user.id);
            name = doctor?.name || '';
        } else if (user.role === 'PHARMACIST') {
            const pharmacist = await this.pharmacistRepository.findByUserId(user.id);
            name = pharmacist?.name || '';
        } else if (user.role === 'ADMIN') {
            name = 'Admin';
        }

        const token = JwtToken.generate({ id: user.id, role: user.role!, email: user.email, });

        return { data: { token, user_id: existingUser.id, email: existingUser.email, name, role: existingUser.role! } }
    }
}
