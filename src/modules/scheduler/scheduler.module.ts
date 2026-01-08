import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
    imports: [RepositoriesModule],
    providers: [SchedulerService],
})
export class SchedulerModule { }
