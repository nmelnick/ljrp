import { Controller, Get, ClassMiddleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK } from "http-status-codes";
import { requestLogger } from "../middleware/RequestLogger";

@Controller("up")
@ClassMiddleware([requestLogger])
export class UpController {

    @Get()
    public async up(req: Request, res: Response): Promise<Response> {
        return res.status(OK).send("OK");
    }
}
