// ================================================================
// Route: /api/metadata
// Fetches common school metadata like classes, sections, etc.
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate } from "../middleware/auth";
import { cacheMiddleware } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// GET /api/metadata/classes
router.get("/classes", authenticate, cacheMiddleware(300), asyncHandler(async (_req: Request, res: Response) => {
    const classes = await db.class.findMany({
        select: {
            id: true, name: true,
            sections: { select: { id: true, name: true } },
        },
    });
    res.json({ success: true, data: classes });
}));

// GET /api/metadata/sections
router.get("/sections", authenticate, cacheMiddleware(300), asyncHandler(async (_req: Request, res: Response) => {
    const sections = await db.section.findMany({
        select: {
            id: true, name: true,
            class: { select: { id: true, name: true } },
        },
    });
    res.json({ success: true, data: sections });
}));

export default router;
