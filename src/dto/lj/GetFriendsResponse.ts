import { FriendGroup } from "./FriendGroup";
import { Friend } from "../api/FriendsGetResponse";

export interface GetFriendsResponse {
    friendgroups?: FriendGroup[];
    friendofs?: Friend[];
    friends: Friend[];
}
