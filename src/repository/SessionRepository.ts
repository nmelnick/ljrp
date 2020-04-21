import { createHash } from "crypto";
import { EntityRepository, Repository } from "typeorm";
import { Session } from "../entity/Session";

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
    public async createWithAuth(appId: string, username: string, password: string): Promise<Session> {
        const session = new Session();
        session.appId = appId;
        session.serverId = 1;
        session.sessionData = {
            username: username,
            hashed: createHash('md5').update(password).digest("hex")
        };
        return this.save(session);
    }
}
