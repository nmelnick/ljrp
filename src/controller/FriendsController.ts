import { Controller, ClassMiddleware, ClassErrorMiddleware, Middleware, Get } from "@overnightjs/core";
import { OK, BAD_REQUEST } from "http-status-codes";
import { Request, Response } from "express";
import { Connection } from "typeorm";
import { apiError } from "../middleware/ApiError";
import { requestLogger } from "../middleware/RequestLogger";
import { session } from "../middleware/Session";
import { DtoFactory } from "../dto/DtoFactory";
import { errorResponse } from "../dto/ErrorResponse";
import { FriendsCheckRequest } from "../dto/FriendsCheckRequest";
import { SessionRepository } from "../repository/SessionRepository";
import { validators } from "../Schema";
import { AbstractConnectionController } from "./AbstractConnectionController";

@Controller("friends")
@ClassMiddleware([requestLogger])
@ClassErrorMiddleware(apiError)
export class FriendsController extends AbstractConnectionController {
    @Get('check')
    @Middleware([session, validators.friendsCheckRequest()])
    public async check(req: Request, res: Response): Promise<Response> {
        const lj = req.context.session.lj;
        const request = DtoFactory.checkFriendsRequest(
            await lj.generateBaseRequest(),
            req.body
        );
        try {
            const response = await lj.checkFriends(request);
            return res.status(OK).send(DtoFactory.friendsCheckResponse(response));
        } catch (e) {
            console.log("Error from checkfriends call", e);
            return res.status(BAD_REQUEST).send(errorResponse(e.faultString));
        }
    }
}
