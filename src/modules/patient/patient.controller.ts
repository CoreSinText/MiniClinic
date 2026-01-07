import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { JwtToken } from 'src/utils/JwtToken';
import { PatientMiddleware } from 'src/middlewares/patient.middleware';

@Controller('patient')
@UseGuards(PatientMiddleware)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('medical-records')
  async getMyMedicalRecords(@Request() req) {
    const header = req.headers['authorization'];
    const token = header.split(' ')[1];
    const decoded = JwtToken.verify(token);

    return this.patientService.getMyMedicalRecords(decoded.id);
  }
}
