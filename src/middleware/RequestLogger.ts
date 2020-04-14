import { Request, Response, NextFunction } from "express";
import { Logger } from "@overnightjs/logger";

/**
 * Middleware to log a request. 
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    Logger.Info(`${req.method} ${req.path}`);
    next();
}
