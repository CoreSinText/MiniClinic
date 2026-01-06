import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { DoctorModule } from './modules/doctor/doctor.module';

@Module({
  imports: [DrizzleModule, AuthModule, AdminModule, DoctorModule],
})
export class AppModule {}
