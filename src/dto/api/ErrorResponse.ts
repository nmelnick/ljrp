export interface ErrorResponse {
    error: string
}

export function errorResponse(error: string): ErrorResponse {
    return {
        error: error
    };
}
