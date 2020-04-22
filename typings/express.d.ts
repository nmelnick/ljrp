declare namespace Express {
    export interface Request {
        id: string;
        context?: import("../src/middleware/CurrentContext").CurrentContext;
    }
}
