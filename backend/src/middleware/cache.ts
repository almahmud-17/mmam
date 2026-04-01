// ================================================================
// Cache Middleware — SchoolSpace Backend
// In-memory caching with node-cache (5 min default TTL)
// ================================================================

import NodeCache from "node-cache";
import { Request, Response, NextFunction } from "express";

const cache = new NodeCache({
    stdTTL: 300,          // 5 minutes default
    checkperiod: 60,      // Check for expired keys every 60s
    useClones: false,     // Better perf — we only store JSON-safe data
});

/**
 * Express middleware that caches GET responses.
 * @param ttlSeconds — cache duration (default 300 = 5 min)
 */
export function cacheMiddleware(ttlSeconds = 300) {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Only cache GET requests
        if (req.method !== "GET") {
            next();
            return;
        }

        const key = `__cache__${req.originalUrl}`;
        const cached = cache.get(key);

        if (cached) {
            res.json(cached);
            return;
        }

        // Override res.json to intercept the response and cache it
        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
            // Only cache successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache.set(key, body, ttlSeconds);
            }
            return originalJson(body);
        };

        next();
    };
}

/**
 * Invalidate all cache entries matching a prefix.
 * Call after POST / PUT / DELETE mutations.
 * @example invalidateCache("/api/students")
 */
export function invalidateCache(...prefixes: string[]): void {
    const keys = cache.keys();
    for (const key of keys) {
        for (const prefix of prefixes) {
            if (key.includes(prefix)) {
                cache.del(key);
                break;
            }
        }
    }
}

/**
 * Flush the entire cache. Useful for admin operations.
 */
export function flushCache(): void {
    cache.flushAll();
}
