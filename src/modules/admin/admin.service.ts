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

@Injectable()
export class AdminService {
    constructor(
        private doctorRepository: DoctorRepository,
        private userRepository: UserRepository,
        private scheduleDoctorRepository: ScheduleDoctorRepository
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
}