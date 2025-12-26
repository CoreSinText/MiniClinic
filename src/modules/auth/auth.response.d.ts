import { roleEnum } from "drizzle/drizzle.schema"

export interface AuthRegisterAdminResponse {
    data: {
        user_id: string,
        email: string,
        role: typeof roleEnum.enumValues[number]
    }
}

export interface AuthRegisterPatientResponse {
    data: {
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
}

export interface AuthRegisterDoctorResponse {
    data: {
        user_id: string,
        email: string,
        licance_number: string,
        specialization: string,
        name: string,
        gender: string,
        role: typeof roleEnum.enumValues[number]
    }
}

export interface AuthRegisterPharmacistResponse {
    data: {
        user_id: string,
        email: string,
        license_number: string,
        name: string,
        gender: string,
        role: typeof roleEnum.enumValues[number]
    }
}


export interface AuthLoginResponse {
    data: {
        token: string
        user_id: string,
        email: string,
        name: string
        role: typeof roleEnum.enumValues[number]
    }
}
