import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { JwtRefreshStrategy } from "./jwt-refresh-strategy";
import { JwtStrategy } from "./jwt-strategy";
import { AuthRepository } from "./repository/auth.repository";
import { AuthService } from "./service/auth.service";

@Global()
@Module({
    imports: [
        PassportModule.register({}),
        JwtModule.register({}),
        TypeOrmModule.forFeature([AuthRepository]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtRefreshStrategy
    ],
    exports: [
        JwtStrategy,
        JwtRefreshStrategy,
        PassportModule
    ]
})
export class AuthModule {}