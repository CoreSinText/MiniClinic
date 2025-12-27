import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { and, asc, count, desc, eq, ilike, SQL } from 'drizzle-orm';

interface CreateMedicineParams {
    name: string;
    stock: number;
    price: string;
    unit: string;
}

interface FindManyMedicineParams {
    take?: number;
    skip?: number;
    search_by_name?: string;
    search_by_id?: string;
    sort_by_name?: 'asc' | 'desc';
}

interface UpdateMedicineParams {
    id: string;
    name?: string;
    stock?: number;
    price?: string;
    unit?: string;
}

@Injectable()
export class MedicineRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async create(params: CreateMedicineParams) {
        const [newMedicine] = await this.db.insert(schema.medicines).values({
            name: params.name,
            stock: params.stock,
            price: params.price,
            unit: params.unit
        }).returning();

        return newMedicine;
    }

    async findMany(query: FindManyMedicineParams) {
        const order = query.sort_by_name === 'desc' ? desc(schema.medicines.name) : asc(schema.medicines.name);
        const filters: SQL[] = [];

        if (query.search_by_name) filters.push(ilike(schema.medicines.name, `%${query.search_by_name}%`));
        if (query.search_by_id) filters.push(eq(schema.medicines.id, query.search_by_id));

        const whereCondition = filters.length > 0 ? and(...filters) : undefined;

        const [medicines, total_data] = await Promise.all([
            this.db.query.medicines.findMany({
                where: whereCondition,
                limit: query.take,
                offset: query.skip,
                orderBy: [order],
            }),
            this.db
                .select({ count: count() })
                .from(schema.medicines)
                .where(whereCondition)
                .then(res => res[0]?.count ?? 0)
        ]);

        return { medicines, total_data };
    }

    async update(params: UpdateMedicineParams) {
        const [updatedMedicine] = await this.db.update(schema.medicines)
            .set({
                name: params.name,
                stock: params.stock,
                price: params.price,
                unit: params.unit
            })
            .where(eq(schema.medicines.id, params.id))
            .returning();

        return updatedMedicine;
    }

    async delete(id: string) {
        await this.db.delete(schema.medicines).where(eq(schema.medicines.id, id));
        return { id };
    }
}
