import { Logger } from "@overnightjs/logger";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to log a request. 
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    req.id = uuidv4();
    Logger.Info(`${req.id} ${req.method} ${req.originalUrl}`);
    next();
}
