import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleAsyncProvider } from "drizzle/drizzle.provider";
import * as schema from '../../drizzle/drizzle.schema';
import { eq } from "drizzle-orm";


interface CreateParams {
    licance_number: string,
    specialization: typeof schema.doctors.specialization.enumValues[number],
    name: string,
    gender: typeof schema.doctors.gender.enumValues[number],
    user_id: string
}
@Injectable()
export class DoctorRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async findById(userId: string) {
        return this.db.query.doctors.findFirst({
            where: eq(schema.doctors.userId, userId),
        });
    }


    async create(params: CreateParams) {
        const [newDoctor] = await this.db.insert(schema.doctors).values({
            licenseNumber: params.licance_number,
            specialization: params.specialization,
            name: params.name,
            gender: params.gender,
            userId: params.user_id
        }).returning({
            id: schema.doctors.id,
            licenseNumber: schema.doctors.licenseNumber,
            specialization: schema.doctors.specialization,
            name: schema.doctors.name,
            gender: schema.doctors.gender,
            userId: schema.doctors.userId
        })

        return newDoctor;
    }
}