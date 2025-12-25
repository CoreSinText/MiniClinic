import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleAsyncProvider } from "drizzle/drizzle.provider";
import * as schema from '../../drizzle/drizzle.schema';
import { eq } from "drizzle-orm";

interface CreateParams {
    user_id: string
    national_id: string,
    name: string
    birth_date: Date
    gender: typeof schema.patients.gender.enumValues[number]
    phone: string
    address: string
}


@Injectable()
export class PatientRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async findPatientByUserId(userId: string) {
        return this.db.query.patients.findFirst({
            where: eq(schema.patients.userId, userId),
        });
    }

    async create(data: CreateParams) {
        const [newUser] = await this.db
            .insert(schema.patients)
            .values({
                nationalId: data.national_id,
                name: data.name,
                dob: new Date(data.birth_date).toISOString().split('T')[0],
                gender: data.gender,
                phone: data.phone,
                address: data.address,
                userId: data.user_id,
            })
            .returning({
                id: schema.patients.id,
                nationalId: schema.patients.nationalId,
                name: schema.patients.name,
                dob: schema.patients.dob,
                gender: schema.patients.gender,
                phone: schema.patients.phone,
                address: schema.patients.address,
                userId: schema.patients.userId,
            });

        return newUser;
    }
}