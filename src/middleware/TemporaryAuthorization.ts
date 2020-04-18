import { Request, Response, NextFunction } from "express";
import { App } from "../entity/App";
import { Connection } from "typeorm";

/**
 * Middleware to allow temporary authorization using an ID. 
 */
export function temporaryAuthorization(req: Request, res: Response, next: NextFunction) {
    const connection = (res.locals["connection"] as Connection);
    const authorization = req.headers.authorization;
    if (authorization) {
        const [authType, authValue] = authorization.split(" ");
        if (authType.toLowerCase() === "bearer") {
            connection
                .getRepository(App)
                .findOne(authValue)
                .then(app => {
                    if (app) {
                        req["apiApplication"] = app;
                        next();
                    } else {
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
