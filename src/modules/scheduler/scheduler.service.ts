import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentRepository } from '../../repositories/appointment.repository';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(private readonly appointmentRepository: AppointmentRepository) { }

    @Cron('0 0 * * *') // Midnight
    async handleCron() {
        this.logger.debug('Running daily appointment reset...');
        try {
            await this.appointmentRepository.deleteAll();
            this.logger.debug('Daily appointment reset completed successfully.');
        } catch (error) {
            this.logger.error('Failed to reset appointments', error);
        }
    }
}
