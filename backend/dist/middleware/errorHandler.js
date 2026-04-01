"use strict";
// ================================================================
// Global Error Handler — SchoolSpace Backend
// Differentiates operational (400) vs server (500) errors
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.asyncHandler = asyncHandler;
exports.globalErrorHandler = globalErrorHandler;
// ─── Custom Error Class ────────────────────────────────────────
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
// ─── Async route wrapper ────────────────────────────────────────
// Wraps async route handlers so thrown/rejected errors reach the
// global error handler without explicit try/catch in every route.
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
// ─── Prisma error codes ────────────────────────────────────────
function handlePrismaError(err) {
    switch (err.code) {
        case "P2002": {
            const fields = err.meta?.target?.join(", ") || "field";
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
function globalErrorHandler(err, _req, res, _next) {
    // Prisma errors
    if (err.code?.startsWith?.("P")) {
        const prismaErr = handlePrismaError(err);
        res.status(prismaErr.statusCode).json({
            success: false,
            error: prismaErr.message,
        });
        return;
    }
    // Operational errors (AppError)
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }
    // Zod validation errors
    if (err.name === "ZodError") {
        const zodErr = err;
        const messages = zodErr.issues?.map((e) => `${e.path.join(".")}: ${e.message}`) ?? [];
        res.status(400).json({
            success: false,
            error: "Validation failed.",
            details: messages,
        });
        return;
    }
    // Multer errors (file upload)
    if (err.name === "MulterError") {
        res.status(400).json({
            success: false,
            error: `File upload error: ${err.message}`,
        });
        return;
    }
    // Unknown / server errors
    console.error("[UNHANDLED ERROR]:", err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === "production"
            ? "Internal server error."
            : err.message || "Internal server error.",
    });
}
//# sourceMappingURL=errorHandler.js.map