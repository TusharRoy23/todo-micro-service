import { Body, Controller, Get, Logger, UseGuards, ValidationPipe } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthenticationGuard } from "src/guards/jwt-authentication.guard";
import { UserLogDto } from "./dto/user-log.dto";
import { UserLog } from "./entity/user-log.entity";
import { UserLogService } from "./service/user-log.service";

@ApiTags('User-log')
@Controller('user-log')
export class UserLogController {
    private logger = new Logger('UserLogController');
    constructor(
        private userLogService: UserLogService
    ) {}

    @MessagePattern({ cmd: 'createuserlog' })
    async createUserLog(
        @Body(ValidationPipe) userLogDto: UserLogDto
    ) {
        return await this.userLogService.createUserLog(userLogDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthenticationGuard)
    @Get('/list')
    async getUserLog(): Promise<UserLog[]> {
        return await this.userLogService.getUserLog();
    }
}