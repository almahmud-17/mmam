"use strict";
// ================================================================
// Route: /api/stats
// Simple key/value stats for homepage (students, teachers, success rate, achievements)
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const router = (0, express_1.Router)();
// GET /api/stats — Public list
router.get("/", async (_req, res) => {
    try {
        const stats = await db_1.db.siteStat.findMany({
            orderBy: { createdAt: "asc" },
        });
        res.json({ success: true, data: stats });
    }
    catch (err) {
        console.error("[GET STATS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch stats." });
    }
});
// PUT /api/stats/:key — Admin update existing stat
router.put("/:key", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
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
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error("[PUT STATS]:", err);
        res.status(500).json({ success: false, error: "Failed to update stat." });
    }
});
exports.default = router;
//# sourceMappingURL=stats.js.map