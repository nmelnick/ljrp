import { ChallengeResponse } from "../../dto/lj/ChallengeResponse";
import { BaseLiveJournal } from "../../service/BaseLiveJournal";
import * as RequestUtil from "../../service/RequestUtil";

class TestLiveJournal extends BaseLiveJournal {
    protected getUrl(): string {
        return "";
    }

    public async getChallenge(): Promise<ChallengeResponse> {
        return {
            challenge: "testchallenge",
            server_time: 0,
            expire_time: 0
        };
    }
}

test("generateBaseRequest provides a ver and a clientversion", async () => {
    const req = await RequestUtil.generateBaseRequest("123abc", "abc123", new TestLiveJournal());
    expect(req.ver).toEqual(1);
    expect(req.clientversion).toBeDefined();
});

test("generateBaseRequest provides an auth_challenge and auth_response", async () => {
    const req = await RequestUtil.generateBaseRequest("123abc", "abc123", new TestLiveJournal());
    expect(req.auth_challenge).toEqual("testchallenge");
    expect(req.auth_response).toBeDefined();
});
