import { Connection } from "typeorm";
import { SessionRepository } from "../repository/SessionRepository";

export abstract class AbstractConnectionController {
    protected connection: Connection;

    protected get sessionRepository(): SessionRepository {
        return this.connection.getCustomRepository(SessionRepository);
    }

    constructor(connection: Connection) {
        this.connection = connection;
    }
}
