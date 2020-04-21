import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

@Entity()
export class Server {
    @PrimaryGeneratedColumn()
    public serverId: number;

    @Column()
    public profileId: number;

    @Column()
    public baseUrl: string;

    @CreateDateColumn()
    public dateCreated: Date;
}
