import { Injectable } from '@nestjs/common';
import { GetDoctorsQueryDto } from './dto/get-doctors-query.dto';
import { DoctorRepository } from 'src/repositories/doctor.repository';
import { GetDoctorsResponse } from './admin.response';

@Injectable()
export class AdminService {
    constructor(
        private doctorRepository: DoctorRepository
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
}