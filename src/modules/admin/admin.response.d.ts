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