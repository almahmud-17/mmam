// ================================================================
// Auth Middleware — JWT token verification
// ================================================================

import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../lib/auth";

// Extend Express Request to include user info
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "Unauthorized: no token provided." });
        return;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload) {
        res.status(401).json({ success: false, error: "Unauthorized: invalid or expired token." });
        return;
    }

    req.user = payload;
    next();
}

export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Unauthorized." });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, error: "Forbidden: insufficient permissions." });
            return;
        }
        next();
    };
}
