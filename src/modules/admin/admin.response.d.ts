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

// Patient Response
export interface GetPatientsResponse {
    data: {
        id: string;
        national_id: string;
        name: string;
        dob: string;
        gender: string;
        phone: string | null;
        address: string | null;
        email: string;
    }[];
    meta: { total_data: number; }
}

export interface PostPatientResponse {
    data: GetPatientsResponse['data'][number]
}

export interface PatchPatientResponse {
    data: GetPatientsResponse['data'][number]
}

export interface DeletePatientResponse {
    data: { id: string }
}

// Pharmacist Response
export interface GetPharmacistsResponse {
    data: {
        id: string;
        name: string;
        gender: string;
        license_number: string | null;
        email: string;
    }[];
    meta: { total_data: number; }
}

export interface PostPharmacistResponse {
    data: GetPharmacistsResponse['data'][number]
}

export interface PatchPharmacistResponse {
    data: GetPharmacistsResponse['data'][number]
}

export interface DeletePharmacistResponse {
    data: { id: string }
}

// Medicine Response
export interface GetMedicinesResponse {
    data: {
        id: string;
        name: string;
        stock: number;
        price: string;
        unit: string;
    }[];
    meta: { total_data: number; }
}

export interface PostMedicineResponse {
    data: GetMedicinesResponse['data'][number]
}

export interface PatchMedicineResponse {
    data: GetMedicinesResponse['data'][number]
}

export interface DeleteMedicineResponse {
    data: { id: string }
}

// Appointment Response
export interface GetAppointmentsResponse {
    data: {
        id: string;
        queue_number: number;
        date: string;
        status: string;
        patient: { id: string, name: string };
        doctor: { id: string, name: string };
    }[];
    meta: { total_data: number; }
}

export interface PostAppointmentResponse {
    data: GetAppointmentsResponse['data'][number]
}

export interface PatchAppointmentResponse {
    data: GetAppointmentsResponse['data'][number]
}
