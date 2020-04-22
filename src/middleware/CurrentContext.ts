import { App } from "../entity/App";
import { Session } from "../entity/Session";

export interface CurrentContext {
    app?: App;
    session?: Session;
}
