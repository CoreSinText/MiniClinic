
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PharmacistRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async create(data: typeof schema.pharmacists.$inferInsert) {
        const [result] = await this.db.insert(schema.pharmacists).values(data).returning();
        return result;
    }

    async findByUserId(userId: string) {
        return this.db.query.pharmacists.findFirst({
            where: eq(schema.pharmacists.userId, userId),
        });
    }
}
