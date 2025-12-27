import { BadRequestException, Injectable } from '@nestjs/common';
import { GetDoctorsQueryDto } from './dto/get-doctors.dto';
import { DoctorRepository } from 'src/repositories/doctor.repository';
import { DeleteScheduleDoctorResponse, GetDoctorsResponse, GetScheduleDoctorResponse, PatchDoctorResponse, PatchScheduleDoctorResponse, PostDoctorResponse, PostScheduleDoctorResponse } from './admin.response';
import { PatchDoctorDto } from './dto/patch-doctor.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { PostDoctorDto } from './dto/post-doctor.dto';
import { GetScheduleDoctorDto } from './dto/get-schedule-doctor.dto';
import { ScheduleDoctorRepository } from 'src/repositories/schedule-doctor.repository';
import { PatchScheduleDoctorDto } from './dto/patch-schedule-doctor.dto';
import { PostScheduleDoctorDto } from './dto/post-schedule-doctor.dto';
import { PatientRepository } from 'src/repositories/patient.repository';
import { PharmacistRepository } from 'src/repositories/pharmacist.repository';
import { MedicineRepository } from 'src/repositories/medicine.repository';
import { GetPatientsQueryDto, PatchPatientDto, PostPatientDto } from './dto/patient.dto';
import { DeleteMedicineResponse, DeletePatientResponse, DeletePharmacistResponse, GetMedicinesResponse, GetPatientsResponse, GetPharmacistsResponse, PatchMedicineResponse, PatchPatientResponse, PatchPharmacistResponse, PostMedicineResponse, PostPatientResponse, PostPharmacistResponse } from './admin.response';
import { GetPharmacistsQueryDto, PatchPharmacistDto, PostPharmacistDto } from './dto/pharmacist.dto';
import { GetMedicinesQueryDto, PatchMedicineDto, PostMedicineDto } from './dto/medicine.dto';

@Injectable()
export class AdminService {
    constructor(
        private doctorRepository: DoctorRepository,
        private userRepository: UserRepository,
        private scheduleDoctorRepository: ScheduleDoctorRepository,
        private patientRepository: PatientRepository,
        private pharmacistRepository: PharmacistRepository,
        private medicineRepository: MedicineRepository
    ) { }

    async getDoctors(query: GetDoctorsQueryDto): Promise<GetDoctorsResponse> {
        const { take, skip, search_by_name, search_by_id, sort_by_name } = query;

        const { doctors, total_data } = await this.doctorRepository.findMany({ take, skip, search_by_name, search_by_id, sort_by_name });

        return {
            data: doctors.map((data: any) => ({
                id: data.id,
                licenseNumber: data.licenseNumber,
                specialization: data.specialization,
                name: data.name,
                gender: data.gender,
                email: data.user.email
            })),
            meta: { total_data: total_data }
        };
    }

    async patchDoctor(id: string, dto: PatchDoctorDto): Promise<PatchDoctorResponse> {
        const { name, gender, licance_number, specialization, email, password } = dto;
        const user = await this.userRepository.findById(id);
        const result: PatchDoctorResponse['data'] = { name: "", gender: "Female", license_number: "", specialization: "GENERAL", email: user?.email!, user_id: "" }

        if (!user) throw new BadRequestException("User not found");
        if (email) {
            const updateEmail = await this.userRepository.update({ id, email, password });
            result.email = updateEmail.email;
        }

        const updateDoctor = await this.doctorRepository.update({ user_id: id, name, gender, licance_number, specialization });
        result.user_id = updateDoctor.userId;
        result.name = updateDoctor.name;
        result.gender = updateDoctor.gender;
        result.license_number = updateDoctor.licenseNumber!;
        result.specialization = updateDoctor.specialization;

        return { data: result }
    }

    async postDoctor(dto: PostDoctorDto): Promise<PostDoctorResponse> {
        const isUserExist = await this.userRepository.findUserByEmail(dto.email);
        if (isUserExist) throw new BadRequestException("User already exists");

        const user = await this.userRepository.create({ email: dto.email, password: dto.password, role: "DOCTOR" });
        const result: PostDoctorResponse['data'] = { name: "", gender: "Female", license_number: "", specialization: "GENERAL", email: user.email, user_id: "" }

        const postDoctor = await this.doctorRepository.create({ user_id: user.id, name: dto.name, gender: dto.gender, licance_number: dto.licance_number, specialization: dto.specialization });
        result.user_id = postDoctor.userId;
        result.name = postDoctor.name;
        result.gender = postDoctor.gender;
        result.license_number = postDoctor.licenseNumber!;
        result.specialization = postDoctor.specialization;

        return { data: result }
    }

    async getScheduleDoctor(query: GetScheduleDoctorDto): Promise<GetScheduleDoctorResponse> {
        const data = await this.scheduleDoctorRepository.findMany(query)
        return {
            data: data.data.map((data: any) => ({
                id: data.id,
                is_active: data.isActive,
                day_of_week: data.dayOfWeek,
                day_name: data.dayName,
                time: { start: data.startTime, end: data.endTime },
                doctor: { id: data.doctor.id, name: data.doctor.name }
            })),
            meta: { total_data: data.total_data }
        }
    }

    async postScheduleDoctor(dto: PostScheduleDoctorDto): Promise<PostScheduleDoctorResponse> {
        const { doctor_id, day_of_week, is_active, end_time, start_time } = dto;

        const isConflict = await this.scheduleDoctorRepository.conflictSchedule({ doctor_id, day_of_week, start_time, end_time });
        if (isConflict) throw new BadRequestException("Schedule already exists");

        const add = await this.scheduleDoctorRepository.create({ doctorId: doctor_id, dayOfWeek: day_of_week, isActive: is_active, endTime: end_time, startTime: start_time });
        return {
            data: {
                id: add.id,
                is_active: add.is_active!,
                day_of_week: add.day_of_week,
                day_name: add.day_name,
                time: { start: add.time.start, end: add.time.end },
                doctor: { id: add.doctor.id, name: add.doctor.name }
            }
        }
    }

    async patchScheduleDoctor(id: string, dto: PatchScheduleDoctorDto): Promise<PatchScheduleDoctorResponse> {
        const { day_of_week, is_active, end_time, start_time } = dto

        const update = await this.scheduleDoctorRepository.update({ id, dayOfWeek: day_of_week, isActive: is_active, endTime: end_time, startTime: start_time });
        return {
            data: {
                id: update.id,
                is_active: update.is_active!,
                day_of_week: update.day_of_week,
                day_name: update.day_name,
                time: { start: update.time.start, end: update.time.end },
                doctor: { id: update.doctor.id, name: update.doctor.name }
            }
        }
    }

    async deleteScheduleDoctor(id: string): Promise<DeleteScheduleDoctorResponse> {
        const deleteScheduleDoctor = await this.scheduleDoctorRepository.delete(id);
        if (!deleteScheduleDoctor) throw new BadRequestException("Schedule not found");

        return {
            data: {
                id: deleteScheduleDoctor.id,
            }
        }
    }

    // Patient
    async getPatients(query: GetPatientsQueryDto): Promise<GetPatientsResponse> {
        const { patients, total_data } = await this.patientRepository.findMany(query);
        return {
            data: patients.map((data: any) => ({
                id: data.id,
                national_id: data.nationalId,
                name: data.name,
                dob: data.dob,
                gender: data.gender,
                phone: data.phone,
                address: data.address,
                email: data.user?.email || ""
            })),
            meta: { total_data }
        }
    }

    async postPatient(dto: PostPatientDto): Promise<PostPatientResponse> {
        const defaultEmail = `${dto.national_id}@clinic.com`;
        const defaultPassword = "password123";

        const isUserExist = await this.userRepository.findUserByEmail(defaultEmail);
        let user: any = isUserExist;

        if (!user) {
            user = await this.userRepository.create({ email: defaultEmail, password: defaultPassword, role: "PATIENT" });
        }

        const patient = await this.patientRepository.create({
            user_id: user.id,
            national_id: dto.national_id,
            name: dto.name,
            birth_date: new Date(dto.birth_date),
            gender: dto.gender,
            phone: dto.phone,
            address: dto.address
        });

        const dobVal = patient.dob;
        const dobStr = typeof dobVal === 'string' ? dobVal : (dobVal as Date).toISOString().split('T')[0];

        return {
            data: {
                id: patient.id,
                national_id: patient.nationalId,
                name: patient.name,
                dob: dobStr,
                gender: patient.gender,
                phone: patient.phone!,
                address: patient.address!,
                email: user.email
            }
        }
    }

    async patchPatient(id: string, dto: PatchPatientDto): Promise<PatchPatientResponse> {
        const patient = await this.patientRepository.update({ id, ...dto, birth_date: dto.birth_date ? new Date(dto.birth_date) : undefined });
        if (!patient) throw new BadRequestException("Patient not found");

        const user = await this.userRepository.findById(patient.userId!);

        const dobVal = patient.dob;
        const dobStr = typeof dobVal === 'string' ? dobVal : (dobVal as Date).toISOString().split('T')[0];

        return {
            data: {
                id: patient.id,
                national_id: patient.nationalId,
                name: patient.name,
                dob: dobStr,
                gender: patient.gender,
                phone: patient.phone!,
                address: patient.address!,
                email: user?.email || ""
            }
        }
    }

    async deletePatient(id: string): Promise<DeletePatientResponse> {
        const deleted = await this.patientRepository.delete(id);
        return { data: deleted };
    }


    // Pharmacist
    async getPharmacists(query: GetPharmacistsQueryDto): Promise<GetPharmacistsResponse> {
        const { pharmacists, total_data } = await this.pharmacistRepository.findMany(query);
        return {
            data: pharmacists.map((data: any) => ({
                id: data.id,
                name: data.name,
                gender: data.gender,
                license_number: data.licenseNumber,
                email: data.user?.email || ""
            })),
            meta: { total_data }
        }
    }

    async postPharmacist(dto: PostPharmacistDto): Promise<PostPharmacistResponse> {
        const defaultEmail = `pharm_${dto.license_number}@clinic.com`;
        const defaultPassword = "password123";

        const isUserExist = await this.userRepository.findUserByEmail(defaultEmail);
        let user: any = isUserExist;

        if (!user) {
            user = await this.userRepository.create({ email: defaultEmail, password: defaultPassword, role: "PHARMACIST" });
        }

        const pharmacist = await this.pharmacistRepository.create({
            user_id: user.id,
            name: dto.name,
            gender: dto.gender,
            license_number: dto.license_number
        });

        return {
            data: {
                id: pharmacist.id,
                name: pharmacist.name,
                gender: pharmacist.gender,
                license_number: pharmacist.licenseNumber!,
                email: user.email
            }
        }
    }

    async patchPharmacist(id: string, dto: PatchPharmacistDto): Promise<PatchPharmacistResponse> {
        const pharmacist = await this.pharmacistRepository.update({ id, ...dto });
        if (!pharmacist) throw new BadRequestException("Pharmacist not found");

        const user = await this.userRepository.findById(pharmacist.userId);

        return {
            data: {
                id: pharmacist.id,
                name: pharmacist.name,
                gender: pharmacist.gender,
                license_number: pharmacist.licenseNumber!,
                email: user?.email || ""
            }
        }
    }

    async deletePharmacist(id: string): Promise<DeletePharmacistResponse> {
        const deleted = await this.pharmacistRepository.delete(id);
        return { data: deleted };
    }

    // Medicine
    async getMedicines(query: GetMedicinesQueryDto): Promise<GetMedicinesResponse> {
        const { medicines, total_data } = await this.medicineRepository.findMany(query);
        return {
            data: medicines.map((data: any) => ({
                id: data.id,
                name: data.name,
                stock: data.stock,
                price: data.price,
                unit: data.unit
            })),
            meta: { total_data }
        }
    }

    async postMedicine(dto: PostMedicineDto): Promise<PostMedicineResponse> {
        const medicine = await this.medicineRepository.create(dto);
        return {
            data: {
                id: medicine.id,
                name: medicine.name,
                stock: medicine.stock!,
                price: medicine.price,
                unit: medicine.unit
            }
        }
    }

    async patchMedicine(id: string, dto: PatchMedicineDto): Promise<PatchMedicineResponse> {
        const medicine = await this.medicineRepository.update({ id, ...dto });
        if (!medicine) throw new BadRequestException("Medicine not found");

        return {
            data: {
                id: medicine.id,
                name: medicine.name,
                stock: medicine.stock!,
                price: medicine.price,
                unit: medicine.unit
            }
        }
    }

    async deleteMedicine(id: string): Promise<DeleteMedicineResponse> {
        const deleted = await this.medicineRepository.delete(id);
        return { data: deleted };
    }
}