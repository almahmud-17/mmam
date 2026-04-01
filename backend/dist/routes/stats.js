"use strict";
// ================================================================
// Route: /api/stats
// Simple key/value stats for homepage
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/stats — Public list
router.get("/", (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const stats = await db_1.db.siteStat.findMany({
        orderBy: { createdAt: "asc" },
    });
    res.json({ success: true, data: stats });
}));
// PUT /api/stats/:key — Admin update existing stat
router.put("/:key", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { key } = req.params;
    const { label, value } = req.body;
    if (!value) {
        res.status(400).json({ success: false, error: "Value is required." });
        return;
    }
    const updated = await db_1.db.siteStat.update({
        where: { key: String(key) },
        data: {
            ...(label ? { label } : {}),
            value: String(value),
        },
    });
    (0, cache_1.invalidateCache)("/api/stats");
    res.json({ success: true, data: updated });
}));
exports.default = router;
//# sourceMappingURL=stats.js.map