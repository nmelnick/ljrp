import { Controller, Post, ClassMiddleware, ClassErrorMiddleware, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK } from "http-status-codes";
import { apiError } from "../middleware/ApiError";
import { requestLogger } from "../middleware/RequestLogger";
import { Connection } from "typeorm";
import { AuthRequest } from "../dto/AuthRequest";
import { validators } from "../Schema";
import { temporaryAuthorization } from "../middleware/TemporaryAuthorization";
import { LiveJournal } from "../service/LiveJournal";
import { DtoFactory } from "../dto/DtoFactory";

@Controller("auth")
@ClassMiddleware([requestLogger])
@ClassErrorMiddleware(apiError)
export class AuthController {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    @Post()
    @Middleware([temporaryAuthorization, validators.authRequest()])
    public async auth(req: Request, res: Response): Promise<Response> {
        const authRequest: AuthRequest = req.body;
        const lj = new LiveJournal(authRequest.username, authRequest.password);
        const request = DtoFactory.loginRequest(
            await lj.generateBaseRequest(),
            authRequest
        );
        const response = await lj.login(request);
        return res.status(OK).send(DtoFactory.authResponse(response));
    }
}
