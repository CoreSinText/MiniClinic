import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../../drizzle/drizzle.schema';
import { DrizzleAsyncProvider } from '../../../../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { RegisterAdminDto } from '../dto/register-admin.dto';

@Injectable()
export class AuthRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async findUserByEmail(email: string) {
        return this.db.query.users.findFirst({
            where: eq(schema.users.email, email),
        });
    }

    async createUser(data: RegisterAdminDto & { role: 'ADMIN' }, hashedPassword: string) {
        const [newUser] = await this.db
            .insert(schema.users)
            .values({
                email: data.email,
                password: hashedPassword,
                role: data.role,
            })
            .returning({
                id: schema.users.id,
                email: schema.users.email,
                role: schema.users.role,
            });

        return newUser;
    }
}
