// ================================================================
// Route: /api/events
// School events / calendar items
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";

const router = Router();

// GET /api/events — public upcoming events
router.get("/", async (_req: Request, res: Response) => {
    try {
        const events = await db.event.findMany({
            orderBy: { date: "asc" },
        });
        res.json({ success: true, data: events });
    } catch (err) {
        console.error("[GET EVENTS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch events." });
    }
});

// POST /api/events — admin create
router.post("/", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { title, date, type, description, imageUrl } = req.body;

        if (!title || !date || !type) {
            res.status(400).json({ success: false, error: "Title, date and type are required." });
            return;
        }

        const created = await db.event.create({
            data: {
                title,
                date: new Date(date),
                type,
                description: description ?? null,
                imageUrl: imageUrl ?? null,
            },
        });

        res.status(201).json({ success: true, data: created });
    } catch (err) {
        console.error("[POST EVENT]:", err);
        res.status(500).json({ success: false, error: "Failed to create event." });
    }
});

// PUT /api/events/:id — admin update
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, date, type, description, imageUrl } = req.body;

        if (!title || !date || !type) {
            res.status(400).json({ success: false, error: "Title, date and type are required." });
            return;
        }

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

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("[PUT EVENT]:", err);
        res.status(500).json({ success: false, error: "Failed to update event." });
    }
});

// DELETE /api/events/:id — admin delete
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.event.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Event deleted." });
    } catch (err) {
        console.error("[DELETE EVENT]:", err);
        res.status(500).json({ success: false, error: "Failed to delete event." });
    }
});

export default router;

