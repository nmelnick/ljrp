import { ErrorObject } from "ajv";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-json-validator-middleware";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status-codes";
import { errorResponse } from "../dto/api/ErrorResponse";

/**
 * An ErrorMiddleware to convert an error string or Error object into a JSON
 * formatted Response.
 */
export function apiError(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    let e = errorResponse("");
    if (typeof(err) == "string") {
        e = errorResponse(err);

    // Handle JSON schema validation errors
    } else if (err instanceof ValidationError) {
        // Hmm, the type does not match what the value looks like
        const hmm = ((err as ValidationError).validationErrors.body as unknown) as ErrorObject[];
        e = errorResponse(hmm.map((eo) => eo.message));

    // Roll up an Error message
    } else {
        e = errorResponse((err as Error).message);
    }
    if (e.errors[0].match("not found")) {
        res.status(NOT_FOUND);
    } else {
        res.status(INTERNAL_SERVER_ERROR);
    }
    res.send(JSON.stringify(e));
}
