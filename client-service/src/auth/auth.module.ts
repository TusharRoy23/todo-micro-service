import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './jwt-strategy';
import { JwtRefreshStrategy } from './jwt-refresh-strategy';
import { AdminService } from 'src/admin-micro-service/admin-service.service';

@Global()
@Module({
    imports: [
        PassportModule.register({}),
        JwtModule.register({}),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AdminService,
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
