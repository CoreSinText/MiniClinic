export interface GetDoctorsResponse {
    data: {
        id: string;
        licenseNumber: string | null;
        specialization: string;
        name: string;
        gender: string;
        email: string
    }[];
    meta: { total_data: number; }
}


export interface PatchDoctorResponse {
    data: {
        user_id: string;
        license_number: string | null;
        specialization: string;
        name: string;
        gender: string;
        email: string
    }
}

export interface PostDoctorResponse {
    data: {
        user_id: string;
        license_number: string | null;
        specialization: string;
        name: string;
        gender: string;
        email: string
    }
}


export interface GetScheduleDoctorResponse {
    data: {
        id: string;
        day_of_week: number;
        day_name: string
        is_active: boolean;
        time: { start: string, end: string }
        doctor: { id: string, name: string }
    }[];
    meta: { total_data: number; }
}

export interface PostScheduleDoctorResponse {
    data: GetScheduleDoctorResponse['data'][number]
}

export interface PatchScheduleDoctorResponse {
    data: GetScheduleDoctorResponse['data'][number]
}

export interface DeleteScheduleDoctorResponse {
    data: { id: string }
}
