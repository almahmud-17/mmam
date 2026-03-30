// ================================================================
// Route: /api/stats
// Simple key/value stats for homepage (students, teachers, success rate, achievements)
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";

const router = Router();

// GET /api/stats — Public list
router.get("/", async (_req: Request, res: Response) => {
    try {
        const stats = await db.siteStat.findMany({
            orderBy: { createdAt: "asc" },
        });
        res.json({ success: true, data: stats });
    } catch (err) {
        console.error("[GET STATS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch stats." });
    }
});

// PUT /api/stats/:key — Admin update existing stat
router.put("/:key", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const { label, value } = req.body;

        if (!value) {
            res.status(400).json({ success: false, error: "Value is required." });
            return;
        }

        const updated = await db.siteStat.update({
            where: { key: String(key) },
            data: {
                ...(label ? { label } : {}),
                value: String(value),
            },
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("[PUT STATS]:", err);
        res.status(500).json({ success: false, error: "Failed to update stat." });
    }
});

export default router;

