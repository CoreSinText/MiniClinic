import { roleEnum } from "drizzle/drizzle.schema"

export interface AuthRegisterAdminResponse {
    user_id: string,
    email: string,
    role: typeof roleEnum.enumValues[number]
}

export interface AuthRegisterPatientResponse {
    user_id: string,
    email: string,
    national_id: string,
    phone_number: string,
    address: string,
    birth_date: string,
    name: string,
    gender: string,
    role: typeof roleEnum.enumValues[number]
}

export interface AuthRegisterDoctorResponse {
    user_id: string,
    email: string,
    licance_number: string,
    specialization: string,
    name: string,
    gender: string,
    role: typeof roleEnum.enumValues[number]
}

export interface AuthRegisterPharmacistResponse {
    user_id: string,
    email: string,
    license_number: string,
    name: string,
    gender: string,
    role: typeof roleEnum.enumValues[number]
}


export interface AuthLoginResponse {
    token: string
    user_id: string,
    email: string,
    name: string
    role: typeof roleEnum.enumValues[number]
}
