import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../lib/auth";
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
export declare function requireRole(...roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map