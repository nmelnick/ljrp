import {Column, Entity, PrimaryColumn, BeforeUpdate} from "typeorm";

@Entity()
export class App {
    @PrimaryColumn()
    public appId: string;

    @Column()
    public appKey: string;

    @Column()
    public name: string;

    @Column()
    public dateCreated: Date;

    @Column()
    public dateModified: Date;

    @BeforeUpdate()
    private updateModified() {
        this.dateModified = new Date();
    }
}
