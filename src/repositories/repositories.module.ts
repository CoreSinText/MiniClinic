import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DrizzleModule } from '../../drizzle/drizzle.module';
import { PatientRepository } from './patient.repository';
import { DoctorRepository } from './doctor.repository';

import { PharmacistRepository } from './pharmacist.repository';
import { ScheduleDoctorRepository } from './schedule-doctor.repository';

@Global()
@Module({
    imports: [DrizzleModule],
    providers: [UserRepository, PatientRepository, DoctorRepository, PharmacistRepository, ScheduleDoctorRepository],
    exports: [UserRepository, PatientRepository, DoctorRepository, PharmacistRepository, ScheduleDoctorRepository],
})
export class RepositoriesModule { }
