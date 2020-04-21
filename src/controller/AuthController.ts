import { Controller, Post, ClassMiddleware, ClassErrorMiddleware, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK, BAD_REQUEST } from "http-status-codes";
import { apiError } from "../middleware/ApiError";
import { requestLogger } from "../middleware/RequestLogger";
import { Connection } from "typeorm";
import { AuthRequest } from "../dto/AuthRequest";
import { validators } from "../Schema";
import { temporaryAuthorization } from "../middleware/TemporaryAuthorization";
import { LiveJournal } from "../service/LiveJournal";
import { DtoFactory } from "../dto/DtoFactory";
import { Session } from "inspector";
import { SessionRepository } from "../repository/SessionRepository";

@Controller("auth")
@ClassMiddleware([requestLogger])
@ClassErrorMiddleware(apiError)
export class AuthController {
    private connection: Connection;

    private get sessionRepository(): SessionRepository {
        return this.connection.getCustomRepository(SessionRepository);
    }

    constructor(connection: Connection) {
        this.connection = connection;
    }

    @Post()
    @Middleware([temporaryAuthorization, validators.authRequest()])
    public async auth(req: Request, res: Response): Promise<Response> {
        const authRequest: AuthRequest = req.body;
        const session = await this.sessionRepository.createWithAuth(req["apiApplication"].appId, authRequest.username, authRequest.password);
        const lj = session.lj;
        const request = DtoFactory.loginRequest(
            await lj.generateBaseRequest(),
            authRequest
        );
        try {
            const response = await lj.login(request);
            return res.status(OK).send(DtoFactory.authResponse(response));
        } catch (e) {
            console.log("Error from login call", e);
            await this.sessionRepository.delete(session);
            const authResponse = {
                error: e.faultString
            };
            return res.status(BAD_REQUEST).send(authResponse);
        }
    }
}
