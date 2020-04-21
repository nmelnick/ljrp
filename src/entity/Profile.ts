import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    public profileId: number;

    @Column()
    public name: string;

    @CreateDateColumn()
    public dateCreated: Date;
}
