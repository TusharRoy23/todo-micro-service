import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthenticationGuard } from "../guards/jwt-authentication.guard";
import { JwtRefreshTokenGuard } from "../guards/jwt-refresh-token.guard";
import { GetUser } from "./decorator/get-user.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { SignInCredentialsDto } from "./dto/signin-credentials.dto";
import { SignupCredentialsDto } from "./dto/signup-credentials.dto";
import { AdminUser } from "./entity/admin-user.entity";
import { AuthService } from "./service/auth.service";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) signupCredentialsDto: SignupCredentialsDto
    ): Promise<{ message: string }> {
        return this.authService.signUp(signupCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe) signinCredentialsDto: SignInCredentialsDto
    ): Promise<{ accessToken: string, refreshToken: string, user: any }>{
        return this.authService.signIn(signinCredentialsDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthenticationGuard)
    @Get('/logout')
    logout(
        @GetUser() adminUser: AdminUser
    ) {
        this.authService.signOut(adminUser);
    }

    @ApiBearerAuth()
    @UseGuards(JwtRefreshTokenGuard)
    @Post('/refresh-token')
    async refreshToken(
        @GetUser() adminUser: AdminUser,
        @Body() token: RefreshTokenDto
    ){
        const user_info = await this.authService.getUserIfRefreshTokenMatches(token.refresh_token, adminUser.username)
        if (user_info) {
            const userInfo = {
                username: user_info.username,
                name: user_info.name
            }

            return this.authService.getNewAccessAndRefreshToken(userInfo)
        } else{
            return null
        }
    }
}