import { InternalServerErrorException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityRepository, Repository } from "typeorm";
import { UserLogDto } from "../dto/user-log.dto";
import { UserLog } from "../entity/user-log.entity";

@EntityRepository(UserLog)
export class UserLogRepository extends Repository<UserLog> {
    async createUserLog(userLogDto: UserLogDto): Promise<boolean> {
        const { userEmail } = userLogDto;

        try {
            const userLog = new UserLog();
            userLog.userEmail = userEmail;

            await userLog.save();
            return true;
        } catch (error) {
            throw new RpcException('Error in User Log');
        }
    }

    async getAllUserLog(): Promise<UserLog[]> {
        const query = this.createQueryBuilder('userlog');
        const logList = await query.getMany();
        return logList;
    }
}