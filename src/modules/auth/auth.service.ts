import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) { }

    async registerAdmin(dto: RegisterAdminDto) {
        const existingUser = await this.userRepository.findUserByEmail(dto.email);

        if (existingUser) throw new ConflictException('Email already registered');

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.userRepository.create({ ...dto, role: 'ADMIN' }, hashedPassword);
    }
}
