import { UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SignInCredentialsDto } from "../dto/signin-credentials.dto";
import { SignupCredentialsDto } from "../dto/signup-credentials.dto";
import { AuthRepository } from "../repository/auth.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { AdminUser } from "../entity/admin-user.entity";

export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpCredentialsDto: SignupCredentialsDto): Promise<{ message: string }> {
        return this.authRepository.signUp(signUpCredentialsDto);
    }

    async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string, refreshToken: string, user: any }> {
        const resp = await this.authRepository.validateUserPassword(signInCredentialsDto);
        
        if (!resp) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const accessToken = await this.getAccessToken(resp)
        const refreshToken = await this.getRefreshToken(resp)

        await this.updateRefreshTokenInUser(refreshToken, resp.username)
        
        return {
            accessToken,
            refreshToken,
            user: resp
        }
    }

    async signOut(adminUser: AdminUser) {
        await this.updateRefreshTokenInUser(null, adminUser.username);
    }

    async updateRefreshTokenInUser(refreshToken, username) {
        if (refreshToken) {
            refreshToken = await bcrypt.hash(refreshToken, 10);
        }
        
        await this.authRepository.update({ username: username }, {
            hashedRefreshToken:refreshToken
        })
    }

    async getAccessToken(payload: any) {
        const accessToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET || "anyKey",
            expiresIn: +process.env.JWT_ADMIN_ACCESS_TOKEN_EXPIRATION_TIME || 900
        })
        return accessToken;
    }

    async getRefreshToken(payload: any) {
        const refreshToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_ADMIN_REFRESH_TOKEN_SECRET || "anyRefreshKey",
            expiresIn: +process.env.JWT_ADMIN_REFRESH_TOKEN_EXPIRATION_TIME || 28800
        })
        return refreshToken;
    }

    async getNewAccessAndRefreshToken(payload: any) {
        const refreshToken = await this.getRefreshToken(payload)
        await this.updateRefreshTokenInUser(refreshToken, payload.username)

        return {
            accessToken: await this.getAccessToken(payload),
            refreshToken: refreshToken
        }
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, username: string): Promise<AdminUser> {
        const user = await this.authRepository.getUserInfoByUsername(username);
     
        const isRefreshTokenMatching = await bcrypt.compare(
          refreshToken,
          user.hashedRefreshToken
        );
     
        if (isRefreshTokenMatching) {
            await this.updateRefreshTokenInUser(null, username);
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}