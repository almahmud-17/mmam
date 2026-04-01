"use strict";
// ================================================================
// Cache Middleware — SchoolSpace Backend
// In-memory caching with node-cache (5 min default TTL)
// ================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = cacheMiddleware;
exports.invalidateCache = invalidateCache;
exports.flushCache = flushCache;
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({
    stdTTL: 300, // 5 minutes default
    checkperiod: 60, // Check for expired keys every 60s
    useClones: false, // Better perf — we only store JSON-safe data
});
/**
 * Express middleware that caches GET responses.
 * @param ttlSeconds — cache duration (default 300 = 5 min)
 */
function cacheMiddleware(ttlSeconds = 300) {
    return (req, res, next) => {
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
        res.json = (body) => {
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
function invalidateCache(...prefixes) {
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
function flushCache() {
    cache.flushAll();
}
//# sourceMappingURL=cache.js.map