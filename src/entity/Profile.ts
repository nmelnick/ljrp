import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    public profileId: number;

    @Column()
    public name: string;

    @CreateDateColumn()
    public dateCreated: Date;
}
