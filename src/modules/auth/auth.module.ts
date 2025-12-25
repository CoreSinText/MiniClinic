import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DrizzleModule } from '../../../drizzle/drizzle.module';
import { AuthRepository } from './repositories/auth.repository';

@Module({
    imports: [DrizzleModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
})
export class AuthModule { }
