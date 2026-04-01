// ================================================================
// Global Error Handler — SchoolSpace Backend
// Differentiates operational (400) vs server (500) errors
// ================================================================

import { Request, Response, NextFunction } from "express";

// ─── Custom Error Class ────────────────────────────────────────
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// ─── Error Response Type ───────────────────────────────────────
export interface ErrorResponse {
    success: false;
    error: string;
    details?: unknown;
}

// ─── Async route wrapper ────────────────────────────────────────
// Wraps async route handlers so thrown/rejected errors reach the
// global error handler without explicit try/catch in every route.
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// ─── Prisma error codes ────────────────────────────────────────
function handlePrismaError(err: any): AppError {
    switch (err.code) {
        case "P2002": {
            const fields = (err.meta?.target as string[])?.join(", ") || "field";
            return new AppError(`A record with this ${fields} already exists.`, 409);
        }
        case "P2025":
            return new AppError("Record not found.", 404);
        case "P2003":
            return new AppError("Related record not found. Check foreign key references.", 400);
        case "P2014":
            return new AppError("This operation violates a required relation.", 400);
        default:
            return new AppError("A database error occurred.", 500, false);
    }
}

// ─── Global Error Middleware ────────────────────────────────────
export function globalErrorHandler(
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Prisma errors
    if ((err as any).code?.startsWith?.("P")) {
        const prismaErr = handlePrismaError(err);
        res.status(prismaErr.statusCode).json({
            success: false,
            error: prismaErr.message,
        } satisfies ErrorResponse);
        return;
    }

    // Operational errors (AppError)
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        } satisfies ErrorResponse);
        return;
    }

    // Zod validation errors
    if (err.name === "ZodError") {
        const zodErr = err as any;
        const messages = zodErr.issues?.map((e: any) => `${e.path.join(".")}: ${e.message}`) ?? [];
        res.status(400).json({
            success: false,
            error: "Validation failed.",
            details: messages,
        } satisfies ErrorResponse);
        return;
    }

    // Multer errors (file upload)
    if (err.name === "MulterError") {
        res.status(400).json({
            success: false,
            error: `File upload error: ${err.message}`,
        } satisfies ErrorResponse);
        return;
    }

    // Unknown / server errors
    console.error("[UNHANDLED ERROR]:", err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === "production"
            ? "Internal server error."
            : err.message || "Internal server error.",
    } satisfies ErrorResponse);
}
