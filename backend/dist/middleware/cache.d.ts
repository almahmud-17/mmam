import { Request, Response, NextFunction } from "express";
/**
 * Express middleware that caches GET responses.
 * @param ttlSeconds — cache duration (default 300 = 5 min)
 */
export declare function cacheMiddleware(ttlSeconds?: number): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Invalidate all cache entries matching a prefix.
 * Call after POST / PUT / DELETE mutations.
 * @example invalidateCache("/api/students")
 */
export declare function invalidateCache(...prefixes: string[]): void;
/**
 * Flush the entire cache. Useful for admin operations.
 */
export declare function flushCache(): void;
//# sourceMappingURL=cache.d.ts.map