import { IWithChallenge } from "./IWithChallenge";
import { IWithRequired } from "./IWithRequired";

export interface LoginRequest extends IWithRequired, IWithChallenge {
    username: string;
    getmoods?: number;
    getmenus?: string;
    getpickws?: string;
    getpickwurls?: string;
}
