import { appointmentStatusEnum, genderEnum } from "drizzle/drizzle.schema";

export interface GetCompleteConsultationResponse {
    data: {
        id: string;
        queue_number: number;
        date: Date;
        status: typeof appointmentStatusEnum.enumValues[number];
        patient_id: string;
        doctor_id: string;
        patient: {
            id: string;
            national_id: string;
            name: string;
            dob: string;
            address: string | null;
            phone: string | null;
            gender: typeof genderEnum.enumValues[number];
            user_id: string | null;
        };
        doctor: {
            id: string;
            name: string;
        };
        medical_record: {
            diagnosis: string;
            symptoms: string;
            notes: string | null;
            treatment: string | null;
        } | null;
    }[];
    meta: { total_data: number };
}

export interface PostPrescriptionResponse {
    data: {
        id: string;
        status: string;
        medical_record_id: string;
    }
}
