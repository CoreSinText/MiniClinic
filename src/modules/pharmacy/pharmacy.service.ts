import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrescriptionRepository, Prescription } from 'src/repositories/prescription.repository';
import type { PrescriptionItem } from 'src/repositories/prescription.repository';
import { MedicineRepository } from 'src/repositories/medicine.repository';
import { PatientRepository } from 'src/repositories/patient.repository';
import { MedicalRecordRepository, MedicalRecord } from 'src/repositories/medical-record.repository';
import { AppointmentRepository } from 'src/repositories/appointment.repository';

interface CreatePrescriptionItem {
  medicineId: string;
  quantity: number;
  instructions: string;
}

interface CreatePrescriptionDto {
  medicalRecordId: string;
  items: CreatePrescriptionItem[];
}

interface PrescriptionRow {
  id: string;
  medicalRecordId: string;
  status: 'PENDING' | 'DISPENSED' | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PrescriptionItemRow {
  id: string;
  prescriptionId: string;
  medicineId: string;
  quantity: number;
  instructions: string;
}

@Injectable()
export class PharmacyService {
  constructor(
    private readonly prescriptionRepo: PrescriptionRepository,
    private readonly medicineRepo: MedicineRepository,
    private readonly patientRepo: PatientRepository,
    private readonly medicalRecordRepo: MedicalRecordRepository,
    private readonly appointmentRepo: AppointmentRepository,
  ) { }

  async createAndGivePrescription(
    dto: CreatePrescriptionDto,
  ): Promise<{ prescription: Prescription; items: PrescriptionItem[] }> {
    // Verify medical record exists
    const mr: MedicalRecord | null = await this.medicalRecordRepo.findById(dto.medicalRecordId);
    if (!mr) throw new NotFoundException('Medical record not found');

    const existing: Prescription | null = await this.prescriptionRepo.findByMedicalRecordId(dto.medicalRecordId);
    if (existing) throw new BadRequestException('Prescription already exists for this medical record');

    // create prescription with 'DISPENSED' status
    const pres: Prescription = await this.prescriptionRepo.create({ medicalRecordId: dto.medicalRecordId, status: 'DISPENSED' });

    // create items and decrement stock
    const itemsPayload: Array<{ prescriptionId: string; medicineId: string; quantity: number; instructions: string }> = dto.items.map((i) => ({
      prescriptionId: pres.id,
      medicineId: i.medicineId,
      quantity: i.quantity,
      instructions: i.instructions,
    }));

    const createdItems: PrescriptionItem[] = await this.prescriptionRepo.createItems(itemsPayload as any);

    for (const it of dto.items) {
      await this.medicineRepo.decrementStock(it.medicineId, it.quantity);
    }

    return {
      prescription: pres,
      items: createdItems,
    };
  }

  async giveExistingPrescription(
    prescriptionId: string,
  ): Promise<Prescription> {
    // fetch prescription with items
    const pres = (await this.prescriptionRepo.findByIdWithItems(prescriptionId)) as (Prescription & { items: PrescriptionItem[] }) | null;
    if (!pres) throw new BadRequestException('Prescription not found');
    if (pres.status === 'DISPENSED') throw new BadRequestException('Prescription already given');

    // decrement stock according to items
    for (const it of pres.items ?? []) {
      await this.medicineRepo.decrementStock(it.medicineId, it.quantity);
    }

    const updated = await this.prescriptionRepo.updateStatus(prescriptionId, 'DISPENSED');
    return updated;
  }

  async getConsultedPatients(query: any): Promise<{ patients: any[]; total_data: number }> {
    const res = await this.patientRepo.findConsultedPatients(query || {});
    return res;
  }

  async getCompleteConsultations() {
    const appointments = await this.appointmentRepo.findCompletedConsultations();
    const mappedAppointments = appointments.map(apt => ({
      id: apt.id,
      queue_number: apt.queueNumber,
      date: apt.date,
      status: apt.status,
      patient_id: apt.patientId,
      doctor_id: apt.doctorId,
      patient: {
        id: apt.patient.id,
        national_id: apt.patient.nationalId,
        name: apt.patient.name,
        dob: apt.patient.dob,
        address: apt.patient.address,
        phone: apt.patient.phone,
        gender: apt.patient.gender,
        user_id: apt.patient.userId,
      },
      doctor: {
        id: apt.doctor.id,
        name: apt.doctor.name,
      },
      medical_record: apt.medicalRecord ? {
        diagnosis: apt.medicalRecord.diagnosis,
        symptoms: apt.medicalRecord.symptoms,
        notes: apt.medicalRecord.notes,
        treatment: apt.medicalRecord.treatment,
      } : null,
    }));

    return {
      data: mappedAppointments,
      meta: { total_data: mappedAppointments.length }
    };
  }
}
