import { LiveJournal } from "./LiveJournal";

export class Loader {
    public static load(profileName: string, baseUrl: string, username: string, hashed: string) {
        const proto = <any>this.getProto(profileName);
        return new proto(baseUrl, username, hashed);
    }

    private static getProto(profileName: string) {
        switch(profileName) {
            case "LiveJournal":
                return LiveJournal;
            default:
                throw new Error("Invalid profile name");
        }
    }
}
