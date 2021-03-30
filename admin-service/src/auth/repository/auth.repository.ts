import { EntityRepository, Repository } from "typeorm";
import { SignupCredentialsDto } from "../dto/signup-credentials.dto";
import { AdminUser } from "../entity/admin-user.entity";
import * as bcrypt from 'bcrypt'
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { SignInCredentialsDto } from "../dto/signin-credentials.dto";

@EntityRepository(AdminUser)
export class AuthRepository extends Repository<AdminUser> {
    async signUp(signUpCredentialsDto: SignupCredentialsDto): Promise<{ message: string }> {
        const { name, username, password } = signUpCredentialsDto;
        const adminUser = new AdminUser();
        adminUser.name = name;
        adminUser.username = username;
        adminUser.salt = await bcrypt.genSalt();

        adminUser.password = await this.hashPassword(password, adminUser.salt);

        try {
            await adminUser.save();
            return { message: 'User successfully created !' };
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(signinCredentialDto: SignInCredentialsDto): Promise <any> {
        const { username, password } = signinCredentialDto
        const auth = await this.findOne({ username })

        if (auth && await auth.validatePassword(password, auth.password)) {
            return {
                username: auth.username,
                name: auth.name
            };
        } else {
            return null;
        }
    }

    async getUserInfoByUsername(username: string) {
        const auth = await this.findOne({ username });
        if (auth) {
            return auth;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt);
    }
}