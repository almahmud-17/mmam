import { Request, Response, NextFunction } from "express";
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number, isOperational?: boolean);
}
export interface ErrorResponse {
    success: false;
    error: string;
    details?: unknown;
}
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void;
export declare function globalErrorHandler(err: Error | AppError, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map