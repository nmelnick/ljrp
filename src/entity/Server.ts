import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Server {
    @PrimaryGeneratedColumn()
    public serverId: number;

    @Column()
    public profileId: number;

    @Column()
    public baseUrl: string;

    @Column()
    public dateCreated: Date;
}
