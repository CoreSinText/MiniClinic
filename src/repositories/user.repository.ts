import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/drizzle.schema';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { roleEnum } from '../../drizzle/drizzle.schema';
import * as bcrypt from 'bcrypt';




interface CreateParams {
    email: string;
    password: string
    role: typeof roleEnum.enumValues[number]
}

interface UpdateParams {
    id: string;
    email: string;
    password: string
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

    async findById(id: string) {
        return this.db.query.users.findFirst({
            where: eq(schema.users.id, id),
        });
    }

    async verifyEmailWithPassword(email: string, password: string) {
        const user = await this.findUserByEmail(email);
        if (!user) return false;
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) return false;
        return user;
    }

    async create(data: CreateParams) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
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

    async update(data: UpdateParams) {
        const [updatedUser] = await this.db
            .update(schema.users)
            .set({ email: data.email, password: data.password ? await bcrypt.hash(data.password, 10) : undefined })
            .where(eq(schema.users.id, data.id))
            .returning({ id: schema.users.id, email: schema.users.email, role: schema.users.role, });

        return updatedUser;
    }

}
