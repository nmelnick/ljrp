import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as bodyParser from "body-parser";
import * as promiseRouter from "express-promise-router";
import { Connection } from "typeorm";
import { AuthController } from "./controller/AuthController";
import { FriendsController } from "./controller/FriendsController";
import { UpController } from "./controller/UpController";
import { injectConnection } from "./middleware/ConnectionInjector";

const inflector = require("json-inflector");

export class LJRPServer extends Server {

    constructor(connection: Connection) {
        super(process.env.NODE_ENV === "development");
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(inflector({
            request: 'camelizeLower',
            response: 'underscore'
        }));
        this.setupControllers(connection);
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Info("Server listening on port " + port);
        });
    }

    private setupControllers(connection: Connection): void {
        const upController = new UpController(connection);
        const authController = new AuthController(connection);
        const friendsController = new FriendsController(connection);
        super.addControllers([
            upController,
            authController,
            friendsController,
            promiseRouter
        ], null, injectConnection(connection));
    }
}
