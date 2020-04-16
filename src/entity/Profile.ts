import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    public profileId: number;

    @Column()
    public name: string;

    @Column()
    public dateCreated: Date;
}
