import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/drizzle.schema';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { roleEnum } from '../../drizzle/drizzle.schema';




interface CreateParams {
    email: string;
    role: typeof roleEnum.enumValues[number]
}

@Injectable()
export class UserRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async findUserByEmail(email: string) {
        return this.db.query.users.findFirst({
            where: eq(schema.users.email, email),
        });
    }

    async create(data: CreateParams, hashedPassword: string) {
        const [newUser] = await this.db
            .insert(schema.users)
            .values({
                email: data.email,
                password: hashedPassword,
                role: data.role,
            })
            .returning({ id: schema.users.id, email: schema.users.email, role: schema.users.role, });

        return newUser;
    }

}
