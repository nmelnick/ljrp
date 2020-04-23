import { ErrorObject } from "ajv";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-json-validator-middleware";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status-codes";

/**
 * An ErrorMiddleware to convert an error string or Error object into a JSON
 * formatted Response.
 */
export function apiError(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    let e = error("");
    if (typeof(err) == "string") {
        e = error(err);

    // Handle JSON schema validation errors
    } else if (err instanceof ValidationError) {
        // Hmm, the type does not match what the value looks like
        const hmm = ((err as ValidationError).validationErrors.body as unknown) as ErrorObject[];
        e = error(hmm.map((eo) => eo.message));

    // Roll up an Error message
    } else {
        e = error((err as Error).message);
    }
    if (e.errors[0].match("not found")) {
        res.status(NOT_FOUND);
    } else {
        res.status(INTERNAL_SERVER_ERROR);
    }
    res.send(JSON.stringify(e));
}

/**
 * Take a given string and return an ApiError object.
 * @param str Error string
 */
function error(str: string | string[]): ApiError {
    return {
        errors: (typeof(str) === "string" ? [str] : str)
    };
}

export class ApiError {
    errors: string[]
}
