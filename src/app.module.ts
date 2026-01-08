import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PatientModule } from './modules/patient/patient.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';

@Module({
  imports: [
    DrizzleModule,
    AuthModule,
    AdminModule,
    DoctorModule,
    PatientModule,
    PharmacyModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
})
export class AppModule { }
