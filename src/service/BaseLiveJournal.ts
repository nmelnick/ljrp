import * as xmlrpc from "xmlrpc";
import { ChallengeResponse } from "../dto/lj/ChallengeResponse";
import { LoginRequest } from "../dto/lj/LoginRequest";
import { LoginResponse } from "../dto/lj/LoginResponse";
import { BaseRequest } from "../dto/lj/IBaseRequest";
import * as RequestUtil from "./RequestUtil";

export abstract class BaseLiveJournal {
    protected hashed: string;
    protected _client: xmlrpc.Client;

    protected abstract getUrl(): string;

    protected get client(): xmlrpc.Client {
        if (!this._client) {
            this._client = this.getClient();
        }
        return this._client;
    }
    
    protected getClient(): xmlrpc.Client {
        return xmlrpc.createClient({
            url: this.getUrl(),
            cookies: false
        });
    }

    /**
     * Perform an xmlrpc methodCall using a Promise instead of a callback.
     * @param method XML-RPC method
     * @param params XML-RPC parameters, as an array
     */
    protected async methodCall(method: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.methodCall(`LJ.XMLRPC.${method}`, params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
    }

    /**
     * Generate a server challenge string for authentication.
     * 
     * https://www.livejournal.com/doc/server/ljp.csp.xml-rpc.getchallenge.html
     */
    public async getChallenge(): Promise<ChallengeResponse> {
        return await this.methodCall("getchallenge");
    }

    /**
     * Validate user's password and get base information needed for client to
     * function.
     * 
     * Login to the server, while announcing your client version. The server
     * returns with whether the password is good or not, the user's name, an
     * optional message to be displayed to the user, the list of the user's
     * friend groups, and other things. 
     * 
     * https://www.livejournal.com/doc/server/ljp.csp.xml-rpc.login.html
     */
    public async login(request: LoginRequest): Promise<LoginResponse> {
        return await this.methodCall("login", [request]);
    }

    /**
     * Generate the base request for most XML-RPC calls, to be built upon for
     * creating a complete request.
     */
    public async generateBaseRequest(): Promise<BaseRequest> {
        return RequestUtil.generateBaseRequest(this.hashed, this);
    }
}
