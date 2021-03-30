import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar' })
    userEmail: string

    @CreateDateColumn({ type: 'timestamp' })
    loginDate: Date
}