import { IWithChallenge } from "./IWithChallenge";
import { IWithRequired } from "./IWithRequired";

export interface GetFriendsRequest extends IWithRequired, IWithChallenge {
    includefriendof?: number;
    includegroups?: number;
    friendlimit?: number;
    includebdays?: number;
}
