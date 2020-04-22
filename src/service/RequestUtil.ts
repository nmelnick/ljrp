import { createHash } from "crypto";

import { IWithRequired } from "../dto/lj/IWithRequired";
import { IWithChallenge } from "../dto/lj/IWithChallenge";
import { BaseLiveJournal } from "./BaseLiveJournal";

type BaseRequest = IWithRequired & IWithChallenge;

/**
 * Generate the base request for most XML-RPC calls, to be built upon for
 * creating a complete request.
 * @param hashedPassword User password, in MD5 hex
 * @param lj Instance of a BaseLiveJournal implementation
 */
export async function generateBaseRequest(username: string, hashedPassword: string, lj: BaseLiveJournal): Promise<BaseRequest> {
    const challenge = await generateChallenge(username, hashedPassword, lj);
    return {...generateRequiredRequest(), ...challenge};
}

function generateRequiredRequest(): IWithRequired {
    return {
        ver: 1,
        clientversion: "ljrp/0.0.1"
    };
}

async function generateChallenge(username: string, hashedPassword: string, lj: BaseLiveJournal): Promise<IWithChallenge> {
    const r = await lj.getChallenge();
    const challenge = r.challenge;
    const response = createHash('md5').update(challenge + hashedPassword).digest("hex");
    return {
        auth_method: "challenge",
        auth_challenge: challenge,
        auth_response: response,
        username: username
    }
}
