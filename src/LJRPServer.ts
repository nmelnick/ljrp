import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as bodyParser from "body-parser";
import * as promiseRouter from "express-promise-router";
import { UpController } from "./controller/UpController";
import { Connection } from "typeorm";

const inflector = require("json-inflector");

export class LJRPServer extends Server {
    // Not a fan here.
    public static connection: Connection;

    constructor(connection: Connection) {
        super(process.env.NODE_ENV === "development");
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(inflector({
            request: 'camelizeLower',
            response: 'underscore'
        }));
        LJRPServer.connection = connection;
        this.setupControllers(connection);
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Info("Server listening on port " + port);
        });
    }

    private setupControllers(connection: Connection): void {
        const upController = new UpController(connection);
        super.addControllers([upController, promiseRouter]);
    }
}
