import {Column, Entity, PrimaryColumn, BeforeUpdate, CreateDateColumn, UpdateDateColumn} from "typeorm";

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

}
