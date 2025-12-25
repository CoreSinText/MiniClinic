import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DrizzleModule } from '../../../drizzle/drizzle.module';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
    imports: [DrizzleModule, RepositoriesModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
