import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { InferInsertModel } from 'drizzle-orm';

type NewPrescription = InferInsertModel<typeof schema.prescriptions>;
type NewPrescriptionItem = InferInsertModel<typeof schema.prescriptionItems>;

@Injectable()
export class PrescriptionRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async create(data: NewPrescription, tx?: any) {
        const executor = tx || this.db;
        const [result] = await executor.insert(schema.prescriptions).values(data).returning();
        return result;
    }

    async createItems(data: NewPrescriptionItem[], tx?: any) {
        const executor = tx || this.db;
        return await executor.insert(schema.prescriptionItems).values(data).returning();
    }
}
