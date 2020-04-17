import { BaseLiveJournal } from "./BaseLiveJournal";

export class LiveJournal extends BaseLiveJournal {
    private defaultUrl: string = "http://www.livejournal.com/interface/xmlrpc";

    protected getUrl(): string {
        return this.defaultUrl;
    }
}
