import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./Profile";

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
    
    @OneToOne(type => Profile, p => p.profileId)
    @JoinColumn({ name: 'profile_id' })
    public profile: Profile;
}
