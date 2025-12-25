import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DrizzleModule } from '../../drizzle/drizzle.module';
import { PatientRepository } from './patient.repository';

@Global()
@Module({
    imports: [DrizzleModule],
    providers: [UserRepository, PatientRepository],
    exports: [UserRepository, PatientRepository],
})
export class RepositoriesModule { }
