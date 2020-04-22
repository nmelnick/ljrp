import { IWithChallenge } from "./IWithChallenge";
import { IWithRequired } from "./IWithRequired";
import { IWithUsername } from "./IWithUsername";

export interface BaseRequest extends IWithRequired, IWithChallenge, IWithUsername {}
