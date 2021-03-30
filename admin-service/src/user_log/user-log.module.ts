import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLogRepository } from "./repository/user-log.repository";
import { UserLogService } from "./service/user-log.service";
import { UserLogController } from "./user-log.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([ UserLogRepository ])
    ],
    controllers: [UserLogController],
    providers: [UserLogService]
})
export class UserLogModule {}