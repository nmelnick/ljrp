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

@Controller("friends")
@ClassMiddleware([requestLogger])
@ClassErrorMiddleware(apiError)
export class FriendsController {
    private connection: Connection;

    private get sessionRepository(): SessionRepository {
        return this.connection.getCustomRepository(SessionRepository);
    }

    constructor(connection: Connection) {
        this.connection = connection;
    }

    @Get('check')
    @Middleware([session, validators.friendsCheckRequest()])
    public async check(req: Request, res: Response): Promise<Response> {
        const friendsCheckRequest: FriendsCheckRequest = req.body;
        const session = req["context"].session;
        const lj = session.lj;
        const request = DtoFactory.checkFriendsRequest(
            await lj.generateBaseRequest(),
            friendsCheckRequest
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
