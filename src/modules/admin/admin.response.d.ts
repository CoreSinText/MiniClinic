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
