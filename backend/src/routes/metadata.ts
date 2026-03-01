// ================================================================
// Route: /api/metadata
// Fetches common school metadata like classes, sections, etc.
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/metadata/classes
router.get("/classes", authenticate, async (_req: Request, res: Response) => {
    try {
        const classes = await db.class.findMany({
            include: { sections: true }
        });
        res.json({ success: true, data: classes });
    } catch (err) {
        console.error("[GET CLASSES]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch classes." });
    }
});

// GET /api/metadata/sections
router.get("/sections", authenticate, async (_req: Request, res: Response) => {
    try {
        const sections = await db.section.findMany({
            include: { class: true }
        });
        res.json({ success: true, data: sections });
    } catch (err) {
        console.error("[GET SECTIONS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch sections." });
    }
});

export default router;
