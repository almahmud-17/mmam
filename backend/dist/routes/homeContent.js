"use strict";
// ================================================================
// Route: /api/home-content
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const SINGLETON_ID = "default";
// GET /api/home-content — public (homepage floating strip)
router.get("/", (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    let row = await db_1.db.homeDailyContent.findUnique({ where: { id: SINGLETON_ID } });
    if (!row) {
        row = await db_1.db.homeDailyContent.create({
            data: { id: SINGLETON_ID },
        });
    }
    res.json({ success: true, data: row });
}));
// PUT /api/home-content — admin only
router.put("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { quranText, quranRef, hadithText, hadithRef, motivational } = req.body;
    const row = await db_1.db.homeDailyContent.upsert({
        where: { id: SINGLETON_ID },
        create: {
            id: SINGLETON_ID,
            quranText: String(quranText ?? ""),
            quranRef: String(quranRef ?? ""),
            hadithText: String(hadithText ?? ""),
            hadithRef: String(hadithRef ?? ""),
            motivational: String(motivational ?? ""),
        },
        update: {
            quranText: String(quranText ?? ""),
            quranRef: String(quranRef ?? ""),
            hadithText: String(hadithText ?? ""),
            hadithRef: String(hadithRef ?? ""),
            motivational: String(motivational ?? ""),
        },
    });
    (0, cache_1.invalidateCache)("/api/home-content");
    res.json({ success: true, data: row });
}));
exports.default = router;
//# sourceMappingURL=homeContent.js.map