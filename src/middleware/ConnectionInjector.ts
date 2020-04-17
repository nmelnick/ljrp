import { Request, Response, NextFunction } from "express";
import { Connection } from "typeorm";
/**
 * Middleware to inject database. 
 */
export function injectConnection(connection: Connection) {
    return (req: Request, res: Response, next: NextFunction) => {
        res.locals["connection"] = connection;
        next();
    }
}
