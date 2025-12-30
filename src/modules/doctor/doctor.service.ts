import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DoctorRepository } from "../../repositories/doctor.repository";
import { ScheduleDoctorRepository } from "../../repositories/schedule-doctor.repository";
import { PostConsultationDto } from "./dto/post-consultation.dto";
import { AppointmentRepository } from "../../repositories/appointment.repository";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleAsyncProvider } from "../../../drizzle/drizzle.provider";
import * as schema from "../../../drizzle/drizzle.schema";
import { GetInProgressResponse, PostConsultationResponse } from "./doctor.response";
import { MedicalRecordRepository } from "../../repositories/medical-record.repository";
import { PrescriptionRepository } from "../../repositories/prescription.repository";

@Injectable()
export class DoctorService {
    constructor(
        private readonly doctorRepository: DoctorRepository,
        private readonly scheduleRepository: ScheduleDoctorRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly medicalRecordRepository: MedicalRecordRepository,
        private readonly prescriptionRepository: PrescriptionRepository,
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async getInProgress(id: string): Promise<GetInProgressResponse> {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) throw new NotFoundException("Doctor profile not found");

        const findCurrentAppointment = await this.appointmentRepository.findCurrentAppointment(doctor.id);
        const medicalRecord = findCurrentAppointment.medicalRecord;
        const patient = findCurrentAppointment.appointment.patient;
        const appointment = findCurrentAppointment.appointment;
        if (!findCurrentAppointment) throw new NotFoundException("No patient currently in progress");

        return {
            data: {
                id: appointment.id,
                queue_number: appointment.queueNumber,
                date: appointment.date,
                status: appointment.status!,
                patient_id: appointment.patientId,
                doctor_id: appointment.doctorId,
                patient: {
                    id: patient.id,
                    national_id: patient.nationalId,
                    name: patient.name,
                    dob: patient.dob,
                    address: patient.address!,
                    phone: patient.phone!,
                    gender: appointment.patient.gender,
                    user_id: appointment.patient.userId!,
                },
                medical_records: medicalRecord.map((item) => ({
                    diagnosis: item.diagnosis!,
                    symptoms: item.symptoms!,
                    notes: item.notes!,
                    treatment: item.treatment!,
                }))
            }
        }
    }

    async postConsultation(dto: PostConsultationDto, userId: string): Promise<PostConsultationResponse> {
        const currentAppointment = await this.getInProgress(userId);

        return await this.db.transaction(async (tx) => {
            // Create Medical Record
            const medicalRecord = await this.medicalRecordRepository.create({
                diagnosis: dto.diagnosis,
                symptoms: dto.symptoms,
                notes: dto.note,
                treatment: dto.treatment,
                appointmentId: currentAppointment.data.id,
                patientId: currentAppointment.data.patient_id,
            }, tx);

            // Create Prescription if there are items
            if (dto.prescription_items && dto.prescription_items.length > 0) {
                const prescription = await this.prescriptionRepository.create({
                    medicalRecordId: medicalRecord.id,
                    status: 'PENDING'
                }, tx);

                await this.prescriptionRepository.createItems(
                    dto.prescription_items.map(item => ({
                        prescriptionId: prescription.id,
                        medicineId: item.medicine_id,
                        quantity: item.quantity,
                        instructions: item.instructions
                    })), tx
                );
            }

            // Update Appointment Status
            await this.appointmentRepository.update({
                id: currentAppointment.data.id,
                status: 'COMPLETE_CONSULTATION'
            }, tx);

            return {
                data: {
                    id: medicalRecord.id,
                    medical_record: {
                        diagnosis: medicalRecord.diagnosis,
                        symptoms: medicalRecord.symptoms,
                        notes: medicalRecord.notes!,
                        treatment: medicalRecord.treatment!,
                    }
                }
            };
        });
    }
}