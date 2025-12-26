import { BadRequestException, Injectable } from '@nestjs/common';
import { GetDoctorsQueryDto } from './dto/get-doctors.dto';
import { DoctorRepository } from 'src/repositories/doctor.repository';
import { GetDoctorsResponse, PatchDoctorResponse } from './admin.response';
import { PatchDoctorDto } from './dto/patch-doctor.dto';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AdminService {
    constructor(
        private doctorRepository: DoctorRepository,
        private userRepository: UserRepository
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
        const { name, gender, licance_number, specialization, email } = dto;
        const user = await this.userRepository.findById(id);
        const result: PatchDoctorResponse['data'] = { name: "", gender: "Female", license_number: "", specialization: "GENERAL", email: "", user_id: "" }

        if (!user) throw new BadRequestException("User not found");
        if (email) {
            const updateEmail = await this.userRepository.update({ id, email });
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
}