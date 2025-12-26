import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { DrizzleModule } from "drizzle/drizzle.module";
import { RepositoriesModule } from "src/repositories/repositories.module";
import { AdminMiddleware } from "src/middlewares/admin.middleware";

@Module({
    imports: [DrizzleModule, RepositoriesModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AdminMiddleware)
            .forRoutes({ path: 'admin/*', method: RequestMethod.ALL });
    }
}
