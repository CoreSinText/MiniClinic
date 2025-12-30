import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { InferInsertModel } from 'drizzle-orm';

type NewMedicalRecord = InferInsertModel<typeof schema.medicalRecords>;

@Injectable()
export class MedicalRecordRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async create(data: NewMedicalRecord, tx?: any) {
        const executor = tx || this.db;
        const [result] = await executor.insert(schema.medicalRecords).values(data).returning();
        return result;
    }
}
