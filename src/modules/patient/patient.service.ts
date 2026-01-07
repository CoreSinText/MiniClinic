import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientRepository } from 'src/repositories/patient.repository';
import { MedicalRecordRepository } from 'src/repositories/medical-record.repository';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepo: PatientRepository,
    private readonly medicalRecordRepo: MedicalRecordRepository,
  ) {}

  async getMyMedicalRecords(userId: string) {
    const patient = await this.patientRepo.findPatientByUserId(userId);
    if (!patient) throw new NotFoundException('Patient not found');

    const records = await this.medicalRecordRepo.findByPatientId(patient.id);
    return records;
  }
}
