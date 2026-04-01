// ================================================================
// Route: /api/events
// School events / calendar items
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";
import { eventSchema, paginate } from "../validations/common";

const router = Router();

// GET /api/events — public upcoming events (paginated)
router.get("/", cacheMiddleware(300), asyncHandler(async (req: Request, res: Response) => {
    const { take, skip } = paginate(req.query);

    const [events, total] = await Promise.all([
        db.event.findMany({
            orderBy: { date: "asc" },
            take,
            skip,
        }),
        db.event.count(),
    ]);

    res.json({ success: true, data: events, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// POST /api/events — admin create
router.post("/", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { title, date, type, description, imageUrl } = parsed.data;

    const created = await db.event.create({
        data: {
            title,
            date: new Date(date),
            type,
            description: description ?? null,
            imageUrl: imageUrl ?? null,
        },
    });

    invalidateCache("/api/events");
    res.status(201).json({ success: true, data: created });
}));

// PUT /api/events/:id — admin update
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { title, date, type, description, imageUrl } = parsed.data;

    const updated = await db.event.update({
        where: { id: String(id) },
        data: {
            title,
            date: new Date(date),
            type,
            description: description ?? null,
            imageUrl: imageUrl ?? null,
        },
    });

    invalidateCache("/api/events");
    res.json({ success: true, data: updated });
}));

// DELETE /api/events/:id — admin delete
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.event.delete({ where: { id: String(id) } });
    invalidateCache("/api/events");
    res.json({ success: true, message: "Event deleted." });
}));

export default router;
