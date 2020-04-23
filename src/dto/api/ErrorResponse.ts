export interface ErrorResponse {
    errors: string[]
}

/**
 * Take a given string and return an ErrorResponse object.
 * @param error Error string or string[]
 */
export function errorResponse(error: string | string[]): ErrorResponse {
    return {
        errors: (typeof(error) === "string" ? [error] : error)
    };
}
