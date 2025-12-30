import { appointmentStatusEnum, genderEnum } from "drizzle/drizzle.schema"

export interface ConsultationResponse {
    data: {
        medical_record_id: string,
        diagnosis: string,
        symptoms: string,
        notes: string,
        treatment: string,
        patient: { id: string, name: string },
    }
}

export interface GetInProgressResponse {
    data: {
        id: string
        queue_number: number,
        date: Date,
        status: typeof appointmentStatusEnum.enumValues[number],
        patient_id: string,
        doctor_id: string,
        patient: {
            id: string,
            national_id: string,
            name: string,
            dob: string,
            address: string,
            phone: string,
            gender: typeof genderEnum.enumValues[number],
            user_id: string,
        },
        medical_records: {
            diagnosis: string,
            symptoms: string,
            notes: string,
            treatment: string,
        }[]
    }
}

export interface PostConsultationResponse {
    data: { id: string, medical_record: GetInProgressResponse['data']['medical_records'][number] }
}
