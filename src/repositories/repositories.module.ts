import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DrizzleModule } from '../../drizzle/drizzle.module';

@Global()
@Module({
    imports: [DrizzleModule],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class RepositoriesModule { }
