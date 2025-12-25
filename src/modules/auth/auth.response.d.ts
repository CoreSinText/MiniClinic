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