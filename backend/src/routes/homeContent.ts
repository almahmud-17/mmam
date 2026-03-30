import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";

const router = Router();
const SINGLETON_ID = "default";

// GET /api/home-content — public (homepage floating strip)
router.get("/", async (_req: Request, res: Response) => {
    try {
        let row = await db.homeDailyContent.findUnique({ where: { id: SINGLETON_ID } });
        if (!row) {
            row = await db.homeDailyContent.create({
                data: { id: SINGLETON_ID },
            });
        }
        res.json({ success: true, data: row });
    } catch (err) {
        console.error("[GET HOME CONTENT]:", err);
        res.status(500).json({ success: false, error: "Failed to load home content." });
    }
});

// PUT /api/home-content — admin only
router.put("/", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
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

        res.json({ success: true, data: row });
    } catch (err) {
        console.error("[PUT HOME CONTENT]:", err);
        res.status(500).json({ success: false, error: "Failed to save home content." });
    }
});

export default router;
