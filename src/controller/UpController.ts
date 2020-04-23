import { ClassMiddleware, Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK } from "http-status-codes";
import { requestLogger } from "../middleware/RequestLogger";
import { AbstractConnectionController } from "./AbstractConnectionController";

@Controller("up")
@ClassMiddleware([requestLogger])
export class UpController extends AbstractConnectionController {

    @Get()
    public async up(req: Request, res: Response): Promise<Response> {
        return res.status(OK).send("OK");
    }
}
