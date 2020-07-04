import { ClassErrorMiddleware, ClassMiddleware, Controller, Get, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import { errorResponse } from "../dto/api/ErrorResponse";
import { DtoFactory } from "../dto/DtoFactory";
import { apiError } from "../middleware/ApiError";
import { requestLogger } from "../middleware/RequestLogger";
import { session } from "../middleware/Session";
import { validators } from "../Schema";
import { AbstractConnectionController } from "./AbstractConnectionController";

@Controller("friends")
@ClassMiddleware([requestLogger])
@ClassErrorMiddleware(apiError)
export class FriendsController extends AbstractConnectionController {
    @Get()
    @Middleware([session, validators.friendsCheckRequest()])
    public async getFriends(req: Request, res: Response): Promise<Response> {
        const lj = req.context.session.lj;
        const request = DtoFactory.getFriendsRequest(
            await lj.generateBaseRequest(),
            req.body
        );
        try {
            const response = await lj.getFriends(request);
            return res.status(OK).send(DtoFactory.friendsGetResponse(response));
        } catch (e) {
            console.log("Error from getfriends call", e);
            return res.status(BAD_REQUEST).send(errorResponse(e.faultString));
        }
    }

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
