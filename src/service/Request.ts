import { createHash } from "crypto";

import { IWithRequired } from "../dto/lj/IWithRequired";
import { IWithChallenge } from "../dto/lj/IWithChallenge";

/**
 * Generate the base request for most XML-RPC calls, to be built upon for
 * creating a complete request.
 * @param hashedPassword User password, in MD5 hex
 */
export async function generateBaseRequest(hashedPassword: string): Promise<(IWithRequired & IWithChallenge)> {
    const challenge = await generateChallenge(hashedPassword);
    return {...generateRequiredRequest(), ...challenge};
}

function generateRequiredRequest(): IWithRequired {
    return {
        ver: 1,
        clientversion: "ljrp/0.0.1"
    };
}

async function generateChallenge(hashedPassword: string): Promise<IWithChallenge> {
    const r = await this.getChallenge();
    const challenge = r.challenge;
    const response = createHash('md5').update(challenge + hashedPassword).digest("hex");
    return {
        auth_method: "challenge",
        auth_challenge: challenge,
        auth_response: response
    }
}
