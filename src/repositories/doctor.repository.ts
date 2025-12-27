import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleAsyncProvider } from "drizzle/drizzle.provider";
import * as schema from '../../drizzle/drizzle.schema';
import { and, asc, count, desc, eq, ilike, SQL } from "drizzle-orm";


interface CreateParams {
    licance_number: string,
    specialization: typeof schema.doctors.specialization.enumValues[number],
    name: string,
    gender: typeof schema.doctors.gender.enumValues[number],
    user_id: string
}

interface FindManyParams {
    take?: number;
    skip?: number;
    search_by_name?: string;
    search_by_id?: string;
    sort_by_name?: 'asc' | 'desc';
}


interface UpdateParams {
    user_id: string,
    licance_number?: string,
    specialization?: typeof schema.doctors.specialization.enumValues[number],
    name?: string,
    gender?: typeof schema.doctors.gender.enumValues[number],
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

    async findMany(query: FindManyParams) {
        const order = query.sort_by_name === 'desc' ? desc(schema.doctors.name) : asc(schema.doctors.name);
        const filters: SQL[] = [];

        if (query.search_by_name) filters.push(ilike(schema.doctors.name, `%${query.search_by_name}%`));
        if (query.search_by_id) filters.push(eq(schema.doctors.id, query.search_by_id));

        const whereCondition = filters.length > 0 ? and(...filters) : undefined;


        const [doctors, total_data] = await Promise.all([
            this.db.query.doctors.findMany({
                where: whereCondition,
                limit: query.take,
                offset: query.skip,
                orderBy: [order],
                with: {
                    user: {
                        columns: { email: true, role: true, }
                    }
                }
            }),
            this.db
                .select({ count: count() })
                .from(schema.doctors)
                .where(whereCondition)
                .then(res => res[0]?.count ?? 0)
        ]);

        return { doctors, total_data };
    }

    async update(params: UpdateParams) {
        const [updatedDoctor] = await this.db
            .update(schema.doctors)
            .set({
                licenseNumber: params.licance_number,
                specialization: params.specialization,
                name: params.name,
                gender: params.gender,
            })
            .where(eq(schema.doctors.userId, params.user_id))
            .returning({
                id: schema.doctors.id,
                licenseNumber: schema.doctors.licenseNumber,
                specialization: schema.doctors.specialization,
                name: schema.doctors.name,
                gender: schema.doctors.gender,
                userId: schema.doctors.userId
            });

        return updatedDoctor;
    }
}