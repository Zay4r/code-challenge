export { };

declare global {
    namespace Express {
        export interface Request {
            user: any;
        }
        export interface Response {
            user: any;
        }
    }
}
declare module "express-serve-static-core" {
    interface Request {

    }
}
