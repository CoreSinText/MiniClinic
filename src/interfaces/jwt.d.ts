import { PgRole } from 'drizzle-orm/pg-core';

export interface Bearer {
  id: number;
  role: PgRole;
  email: string;
}
