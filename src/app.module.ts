import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
    imports: [
        DrizzleModule,
        AuthModule,
        AdminModule,
    ],
})
export class AppModule { }
