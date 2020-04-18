import { IWithChallenge } from "./IWithChallenge";
import { IWithRequired } from "./IWithRequired";

export interface BaseRequest extends IWithRequired, IWithChallenge {}
