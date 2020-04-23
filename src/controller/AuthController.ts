import { ClassErrorMiddleware, ClassMiddleware, Controller, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import { AuthRequest } from "../dto/api/AuthRequest";
import { errorResponse } from "../dto/api/ErrorResponse";
import { DtoFactory } from "../dto/DtoFactory";
import { apiError } from "../middleware/ApiError";
import { requestLogger } from "../middleware/RequestLogger";
import { temporaryAuthorization } from "../middleware/TemporaryAuthorization";
import { validators } from "../Schema";
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
