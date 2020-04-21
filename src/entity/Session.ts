import {Column, Entity, PrimaryColumn, CreateDateColumn, ValueTransformer, BeforeInsert} from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { SessionData } from "../dto/SessionData";
import { BaseLiveJournal } from "../service/BaseLiveJournal";
import { Loader } from "../service/Loader";

class SessionDataTransformer implements ValueTransformer {
    from(value: string): SessionData {
        return JSON.parse(value);
    }

    to(value: SessionData): string {
        return JSON.stringify(value);
    }
}

@Entity()
export class Session {
    private _lj: BaseLiveJournal;

    @PrimaryColumn()
    public sessionId: string;

    @Column()
    public appId: string;

    @Column()
    public serverId: number;

    @Column({ type: String, transformer: new SessionDataTransformer() })
    public sessionData: SessionData;

    @CreateDateColumn()
    public dateCreated: Date;

    @Column()
    public dateExpires: Date;

    @BeforeInsert()
    public generateUuid(): void {
        this.sessionId = uuidv4();
    }

    public get lj(): BaseLiveJournal {
        if (!this._lj) {
            const profile = "LiveJournal";
            const server = "http://www.livejournal.com/interface/xmlrpc";
            this._lj = Loader.load(profile, server, this.sessionData.username, this.sessionData.hashed);
        }
        return this._lj;
    }
}
