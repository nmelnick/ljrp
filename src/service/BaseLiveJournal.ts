import * as xmlrpc from "xmlrpc";
import { ChallengeResponse } from "../dto/lj/ChallengeResponse";

export abstract class BaseLiveJournal {
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
}
