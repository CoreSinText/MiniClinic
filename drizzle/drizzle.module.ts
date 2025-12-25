import { Global, Module } from '@nestjs/common';
import { drizzleProvider, DrizzleAsyncProvider } from './drizzle.provider';

@Global()
@Module({
    providers: [...drizzleProvider],
    exports: [...drizzleProvider],
})
export class DrizzleModule { }
