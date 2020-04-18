import { BaseLiveJournal } from "./BaseLiveJournal";
import { createHash } from "crypto";

export class LiveJournal extends BaseLiveJournal {
    private defaultUrl: string = "http://www.livejournal.com/interface/xmlrpc";

    protected getUrl(): string {
        return this.defaultUrl;
    }

    constructor(username: string, password: string) {
        super();
        this.hashed = createHash('md5').update(password).digest("hex");
    }
}
