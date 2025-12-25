import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './drizzle.schema';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const drizzleProvider = [
    {
        provide: DrizzleAsyncProvider,
        useFactory: async () => {
            const pool = new Pool({
                connectionString: process.env.DATABASE_URL,
            });

            return drizzle(pool, { schema });
        },
        exports: [DrizzleAsyncProvider],
    },
];
