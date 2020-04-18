import { Controller, Post, ClassMiddleware, ClassErrorMiddleware, Middleware } from "@overnightjs/core";
import { createHash } from "crypto";
import { Request, Response } from "express";
import { OK } from "http-status-codes";
import { apiError } from "../middleware/ApiError";
import { requestLogger } from "../middleware/RequestLogger";
import { Connection } from "typeorm";
import { AuthRequest } from "../dto/AuthRequest";
import { validators } from "../Schema";
import { temporaryAuthorization } from "../middleware/TemporaryAuthorization";
import { LiveJournal } from "../service/LiveJournal";
import { generateBaseRequest } from "../service/RequestUtil";
import { LoginRequest } from "../dto/lj/LoginRequest";

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
        const lj = new LiveJournal();
        const hashed = createHash('md5').update(authRequest.password).digest("hex");
        const request: LoginRequest = Object.assign(
            await generateBaseRequest(hashed, lj),
            {
                username: authRequest.username,
                getmoods: (authRequest.last_mood_id || null),
                getpickws: (authRequest.get_picture_keywords ? "1" : "0"),
                getpickwurls: (authRequest.get_picture_urls ? "1" : "0")
            }
        );
        const response = await lj.login(request);
        console.log(response);
        return res.status(OK).send("OK");
    }
}
