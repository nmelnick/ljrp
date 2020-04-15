import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { config } from "./Config";
import { LJRPServer } from "./LJRPServer";
import { Logger } from "@overnightjs/logger";

getConnectionOptions().then((connectionOptions) => {
    createConnection(Object.assign(connectionOptions, {
        namingStrategy: new SnakeNamingStrategy()
    }))
        .then(async (connection) => {
            const server = new LJRPServer(connection);
            server.start(config.port);
        })
        .catch((error) => Logger.Info(error));
    });
