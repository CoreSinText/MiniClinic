import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DrizzleModule } from '../../drizzle/drizzle.module';
import { PatientRepository } from './patient.repository';
import { DoctorRepository } from './doctor.repository';

import { PharmacistRepository } from './pharmacist.repository';
import { ScheduleDoctorRepository } from './schedule-doctor.repository';

import { MedicineRepository } from './medicine.repository';
import { AppointmentRepository } from './appointment.repository';
import { MedicalRecordRepository } from './medical-record.repository';
import { PrescriptionRepository } from './prescription.repository';

@Global()
@Module({
    imports: [DrizzleModule],
    providers: [UserRepository, PatientRepository, DoctorRepository, PharmacistRepository, ScheduleDoctorRepository, MedicineRepository, AppointmentRepository, MedicalRecordRepository, PrescriptionRepository],
    exports: [UserRepository, PatientRepository, DoctorRepository, PharmacistRepository, ScheduleDoctorRepository, MedicineRepository, AppointmentRepository, MedicalRecordRepository, PrescriptionRepository],
})
export class RepositoriesModule { }
