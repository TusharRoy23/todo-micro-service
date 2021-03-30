import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserLogDto } from "../dto/user-log.dto";
import { UserLog } from "../entity/user-log.entity";
import { UserLogRepository } from "../repository/user-log.repository";

@Injectable()
export class UserLogService {
    constructor(
        @InjectRepository(UserLogRepository)
        private userLogRepository: UserLogRepository
    ) {}

    async createUserLog(userLogDto: UserLogDto): Promise<boolean> {
        return await this.userLogRepository.createUserLog(userLogDto);
    }

    async getUserLog(): Promise<UserLog[]> {
        return await this.userLogRepository.getAllUserLog();
    }
}