import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Session {
    @PrimaryColumn()
    public sessionId: string;

    @Column()
    public appId: string;

    @Column()
    public serverId: number;

    @Column()
    public sessionData: string;

    @Column()
    public dateCreated: Date;

    @Column()
    public dateExpires: Date;
}
