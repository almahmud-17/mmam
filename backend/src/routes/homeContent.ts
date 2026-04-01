// ================================================================
// Route: /api/home-content
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
const SINGLETON_ID = "default";

// GET /api/home-content — public (homepage floating strip)
router.get("/", cacheMiddleware(300), asyncHandler(async (_req: Request, res: Response) => {
    let row = await db.homeDailyContent.findUnique({ where: { id: SINGLETON_ID } });
    if (!row) {
        row = await db.homeDailyContent.create({
            data: { id: SINGLETON_ID },
        });
    }
    res.json({ success: true, data: row });
}));

// PUT /api/home-content — admin only
router.put("/", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const { quranText, quranRef, hadithText, hadithRef, motivational } = req.body;

    const row = await db.homeDailyContent.upsert({
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

    invalidateCache("/api/home-content");
    res.json({ success: true, data: row });
}));

export default router;
