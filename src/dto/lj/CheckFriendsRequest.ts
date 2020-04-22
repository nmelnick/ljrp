import { IWithChallenge } from "./IWithChallenge";
import { IWithRequired } from "./IWithRequired";

export interface CheckFriendsRequest extends IWithRequired, IWithChallenge {
    lastupdate: string;
    mask?: number;
}
