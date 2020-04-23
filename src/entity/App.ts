import * as jwt from "jsonwebtoken";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class App {
    @PrimaryColumn()
    public appId: string;

    @Column()
    public apiKey: string;

    @Column()
    public name: string;

    @CreateDateColumn()
    public dateCreated: Date;

    @UpdateDateColumn()
    public dateModified: Date;

    public signJwt(id: string): string {
        return jwt.sign(
            {
                expiresIn: 3600,
                sid: id
            },
            this.apiKey
        );
    }
}
