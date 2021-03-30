import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

@Entity()
@Unique(['username'])
export class AdminUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    name: string

    @Column({ type: "varchar" })
    username: string

    @Column({ type: "varchar" })
    password: string

    @Column()
    salt: string

    @Column({ nullable: true })
    @Exclude()
    public hashedRefreshToken?: string

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword).then(result => result)
    }
}