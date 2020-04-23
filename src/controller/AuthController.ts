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
import { errorResponse } from "../dto/ErrorResponse";
import { Logger } from "@overnightjs/logger";
import { AbstractConnectionController } from "./AbstractConnectionController";

@Controller("auth")
@ClassMiddleware([requestLogger])
@ClassErrorMiddleware(apiError)
export class AuthController extends AbstractConnectionController {
    @Post()
    @Middleware([temporaryAuthorization, validators.authRequest()])
    public async auth(req: Request, res: Response): Promise<Response> {
        const authRequest: AuthRequest = req.body;
        const app = req.context.app;
        const session = await this.sessionRepository.createWithAuth(app.appId, authRequest.username, authRequest.password);
        const lj = session.lj;
        const request = DtoFactory.loginRequest(
            await lj.generateBaseRequest(),
            authRequest
        );
        try {
            const response = DtoFactory.authResponse(await lj.login(request));
            response.jwt = app.signJwt(session.sessionId);
            return res.status(OK).send(response);
        } catch (e) {
            console.log("Error from login call", e);
            await this.sessionRepository.delete(session);
            return res.status(BAD_REQUEST).send(errorResponse(e.faultString));
        }
    }
}
