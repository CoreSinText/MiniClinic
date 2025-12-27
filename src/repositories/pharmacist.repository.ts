
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { and, asc, count, desc, eq, ilike, SQL } from 'drizzle-orm';

interface CreateParams {
    user_id: string;
    name: string;
    gender: typeof schema.pharmacists.gender.enumValues[number];
    license_number: string;
}

interface FindManyPharmacistParams {
    take?: number;
    skip?: number;
    search_by_name?: string;
    search_by_id?: string;
    sort_by_name?: 'asc' | 'desc';
}

interface UpdatePharmacistParams {
    id: string;
    name?: string;
    gender?: typeof schema.pharmacists.gender.enumValues[number];
    license_number?: string;
}

@Injectable()
export class PharmacistRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async create(data: CreateParams) {
        const [result] = await this.db.insert(schema.pharmacists).values({
            name: data.name,
            gender: data.gender,
            licenseNumber: data.license_number,
            userId: data.user_id
        }).returning();
        return result;
    }

    async findMany(query: FindManyPharmacistParams) {
        const order = query.sort_by_name === 'desc' ? desc(schema.pharmacists.name) : asc(schema.pharmacists.name);
        const filters: SQL[] = [];

        if (query.search_by_name) filters.push(ilike(schema.pharmacists.name, `%${query.search_by_name}%`));
        if (query.search_by_id) filters.push(eq(schema.pharmacists.id, query.search_by_id));

        const whereCondition = filters.length > 0 ? and(...filters) : undefined;

        const [pharmacists, total_data] = await Promise.all([
            this.db.query.pharmacists.findMany({
                where: whereCondition,
                limit: query.take,
                offset: query.skip,
                orderBy: [order],
                with: {
                    user: { columns: { email: true } }
                }
            }),
            this.db
                .select({ count: count() })
                .from(schema.pharmacists)
                .where(whereCondition)
                .then(res => res[0]?.count ?? 0)
        ]);

        return { pharmacists, total_data };
    }


    async findByUserId(userId: string) {
        return this.db.query.pharmacists.findFirst({
            where: eq(schema.pharmacists.userId, userId),
        });
    }

    async update(params: UpdatePharmacistParams) {
        const [updatedPharmacist] = await this.db.update(schema.pharmacists)
            .set({
                name: params.name,
                gender: params.gender,
                licenseNumber: params.license_number
            })
            .where(eq(schema.pharmacists.id, params.id))
            .returning();

        return updatedPharmacist;
    }

    async delete(id: string) {
        await this.db.delete(schema.pharmacists).where(eq(schema.pharmacists.id, id));
        return { id };
    }
}
