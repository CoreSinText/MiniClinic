import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DoctorController } from "./doctor.controller";
import { DoctorService } from "./doctor.service";
import { DrizzleModule } from "drizzle/drizzle.module";
import { RepositoriesModule } from "src/repositories/repositories.module";
import { DoctorMiddleware } from "src/middlewares/doctor.middleware";

@Module({
    imports: [DrizzleModule, RepositoriesModule],
    controllers: [DoctorController],
    providers: [DoctorService],
})
export class DoctorModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(DoctorMiddleware).forRoutes(DoctorController);
    }
}
