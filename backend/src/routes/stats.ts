// ================================================================
// Route: /api/stats
// Simple key/value stats for homepage
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// GET /api/stats — Public list
router.get("/", cacheMiddleware(300), asyncHandler(async (_req: Request, res: Response) => {
    const stats = await db.siteStat.findMany({
        orderBy: { createdAt: "asc" },
    });
    res.json({ success: true, data: stats });
}));

// PUT /api/stats/:key — Admin update existing stat
router.put("/:key", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
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

    invalidateCache("/api/stats");
    res.json({ success: true, data: updated });
}));

export default router;
