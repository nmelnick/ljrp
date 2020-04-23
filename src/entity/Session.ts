import * as crypto from "crypto";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, ValueTransformer, BeforeUpdate } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { config } from "../Config";
import { SessionData } from "../dto/SessionData";
import { BaseLiveJournal } from "../service/BaseLiveJournal";
import { Loader } from "../service/Loader";
import { App } from "./App";
import { Server } from "./Server";

class SessionDataTransformer implements ValueTransformer {
    from(value: string): SessionData {
        return JSON.parse(this.decrypt(value));
    }

    to(value: SessionData): string {
        return this.encrypt(JSON.stringify(value));
    }

    encrypt(v: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(config.base), iv);
        let encrypted = cipher.update(v);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    decrypt(v: string): string {
        const cString = v.split(":");
        const iv = Buffer.from(cString.shift(), 'hex');
        const enc = Buffer.from(cString.join(":"), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.base), iv);
        let decrypted = decipher.update(enc);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
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

    @Column()
    public dateCreated: Date;

    @Column()
    public dateExpires: Date;
    
    @OneToOne(type => App, a => a.appId)
    @JoinColumn({ name: 'app_id' })
    public app: App;
    
    @OneToOne(type => Server, s => s.serverId)
    @JoinColumn({ name: 'server_id' })
    public server: Server;

    @BeforeInsert()
    public beforeInsert(): void {
        this.sessionId = uuidv4();
        this.dateCreated = new Date();
    }

    public get lj(): BaseLiveJournal {
        if (!this._lj) {
            const profile = "LiveJournal";
            this._lj = Loader.load(profile, this.server.baseUrl, this.sessionData.username, this.sessionData.hashed);
        }
        return this._lj;
    }
}
