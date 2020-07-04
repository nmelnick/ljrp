import * as xmlrpc from "xmlrpc";
import { ChallengeResponse } from "../dto/lj/ChallengeResponse";
import { CheckFriendsRequest } from "../dto/lj/CheckFriendsRequest";
import { CheckFriendsResponse } from "../dto/lj/CheckFriendsResponse";
import { BaseRequest } from "../dto/lj/IBaseRequest";
import { LoginRequest } from "../dto/lj/LoginRequest";
import { LoginResponse } from "../dto/lj/LoginResponse";
import * as RequestUtil from "./RequestUtil";
import { GetFriendsRequest } from "../dto/lj/GetFriendsRequest";
import { GetFriendsResponse } from "../dto/lj/GetFriendsResponse";

export abstract class BaseLiveJournal {
    protected username: string;
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
     * Checks to see if your Friends list has been updated since a specified
     * time.
     * 
     * Mode that clients can use to poll the server to see if their Friends
     * list has been updated. This request is extremely quick, and is the
     * preferred way for users to see when their Friends list is updated,
     * rather than pounding on reload in their browser, which is stressful on
     * the servers.
     * 
     * https://www.livejournal.com/doc/server/ljp.csp.xml-rpc.checkfriends.html
     * 
     * @param request A [[CheckFriendsRequest]] instance
     */
    public async checkFriends(request: CheckFriendsRequest): Promise<CheckFriendsResponse> {
        return await this.methodCall("checkfriends", [request]);
    }

    /**
     * Returns a list of which other LiveJournal users this user lists as their
     * friend.
     * 
     * Returns a verbose list of information on friends a user has listed.
     * Optionally able to include their Friends-of list, the friends group
     * associated with each user, and a limit on the number of friends to
     * return. 
     * 
     * https://www.livejournal.com/doc/server/ljp.csp.xml-rpc.getfriends.html
     * 
     * @param request A [[GetFriendsRequest]] instance
     */
    public async getFriends(request: GetFriendsRequest): Promise<GetFriendsResponse> {
        return await this.methodCall("getfriends", [request]);
    }

    /**
     * Generate the base request for most XML-RPC calls, to be built upon for
     * creating a complete request.
     */
    public async generateBaseRequest(): Promise<BaseRequest> {
        return RequestUtil.generateBaseRequest(this.username, this.hashed, this);
    }
}
