import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository) { }

    async registerAdmin(dto: RegisterAdminDto) {
        // Check if user exists
        const existingUser = await this.authRepository.findUserByEmail(dto.email);

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user
        return this.authRepository.createUser(
            { ...dto, role: 'ADMIN' },
            hashedPassword,
        );
    }
}
