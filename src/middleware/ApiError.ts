import { Request, NextFunction, Response } from "express";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status-codes";

/**
 * An ErrorMiddleware to convert an error string or Error object into a JSON
 * formatted Response.
 */
export function apiError(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    let message = "";
    if (typeof(err) == "string") {
        message = err;
    } else {
        message = (err as Error).message;
    }
    if (message.match("not found")) {
        res.status(NOT_FOUND);
    } else {
        res.status(INTERNAL_SERVER_ERROR);
    }
    res.send(JSON.stringify(error(message)));
}

/**
 * Take a given string and return an ApiError object.
 * @param str Error string
 */
function error(str: string): ApiError {
    return {
        error: str
    };
}

export class ApiError {
    error: string
}
