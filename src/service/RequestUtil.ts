import { createHash } from "crypto";
import { BaseRequest } from "../dto/lj/IBaseRequest";
import { IWithChallenge } from "../dto/lj/IWithChallenge";
import { IWithRequired } from "../dto/lj/IWithRequired";
import { BaseLiveJournal } from "./BaseLiveJournal";

/**
 * Generate the base request for most XML-RPC calls, to be built upon for
 * creating a complete request.
 * @param hashedPassword User password, in MD5 hex
 * @param lj Instance of a BaseLiveJournal implementation
 */
export async function generateBaseRequest(username: string, hashedPassword: string, lj: BaseLiveJournal): Promise<BaseRequest> {
    const challenge = await generateChallenge(username, hashedPassword, lj);
    return {username: username, ...generateRequiredRequest(), ...challenge};
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
        auth_response: response
    }
}
