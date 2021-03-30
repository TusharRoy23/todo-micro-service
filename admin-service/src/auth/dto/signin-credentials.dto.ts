import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class SignInCredentialsDto {
    @ApiProperty()
    @IsEmail()
    username: string

    @ApiProperty({ minimum: 6, maximum: 20, description: 'At least 1 capital, 1 small, 1 special character & 1 number' })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password too weak'}
    )
    password: string
}