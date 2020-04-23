import { Logger } from "@overnightjs/logger";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Connection } from "typeorm";
import { App } from "../entity/App";
import { Session } from "../entity/Session";
import { SessionRepository } from "../repository/SessionRepository";

/**
 * Middleware to allow temporary authorization using an ID. 
 */
export function session(req: Request, res: Response, next: NextFunction) {
    const connection = (res.locals["connection"] as Connection);
    const authorization = req.headers.authorization;
    const appId = req.header('X-App-Id');
    if (authorization && appId) {
        const [authType, authValue] = authorization.split(" ");
        if (authType.toLowerCase() === "bearer") {
            connection
                .getRepository(App)
                .findOne(appId)
                .then((app: App) => {
                    if (app) {
                        return jwt.verify(authValue, app.apiKey);
                    } else {
                        Logger.Info(`${req.id} App ${appId} failed JWT verification`);
                        throw new Error("Invalid authorization");
                    }
                })
                .then((decoded) => {
                    return connection
                        .getCustomRepository(SessionRepository)
                        .findOne(decoded["sid"], { relations: ["app", "server"] });
                })
                .then((session: Session) => {
                    if (session && session.appId == appId) {
                        req.context = req.context || {};
                        req.context.session = session;
                        req.context.app = session.app;
                        Logger.Info(`${req.id} App ${req.context.app.appId} Session ${req.context.session.sessionId} authenticated`);
                        next();
                    } else {
                        Logger.Info(`${req.id} App ${req.context.app.appId} Session ${req.context.session.sessionId} failed`);
                        throw new Error("Invalid authorization");
                    }
                })
                .catch((e) => {
                    next(e);
                });
        } else {
            throw new Error("Invalid authorization type");
        }
    } else {
        throw new Error("No authorization found");
    }
}
