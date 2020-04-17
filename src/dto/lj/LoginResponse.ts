import { FriendGroup } from "./FriendGroup";
import { Mood } from "./Mood";

export interface LoginResponse {
    userid: number;
    username: string;
    fullname: string;
    message?: string;
    defaultpicurl?: string;
    fastserver?: boolean;
    usejournals?: string[];
    pickws?: string[];
    pickwurls?: string[];
    friendgroups: FriendGroup[];
    moods?: Mood[];
}
