import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AdminUser } from "./entity/admin-user.entity";
import { AuthRepository } from "./repository/auth.repository";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository
    ){
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: process.env.JWT_ADMIN_REFRESH_TOKEN_SECRET || "anyRefreshKey"
        })
    }

    async validate(payload: any): Promise<AdminUser> {
        const { username } = payload;
        const user = await this.authRepository.findOne({ username });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}