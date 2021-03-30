import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { AdminUser } from "./entity/admin-user.entity";
import { AuthRepository } from "./repository/auth.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET || "anyKey"
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