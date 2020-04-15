import { Controller, Get, ClassMiddleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK } from "http-status-codes";
import { requestLogger } from "../middleware/RequestLogger";
import { Connection } from "typeorm";

@Controller("up")
@ClassMiddleware([requestLogger])
export class UpController {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    @Get()
    public async up(req: Request, res: Response): Promise<Response> {
        return res.status(OK).send("OK");
    }
}
