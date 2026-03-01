// ================================================================
// Route: /api/notices
// Manages school notices and announcements
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";

const router = Router();

// GET /api/notices — Public list
router.get("/", async (_req: Request, res: Response) => {
    try {
        const notices = await db.notice.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.json({ success: true, data: notices });
    } catch (err) {
        console.error("[GET NOTICES]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch notices." });
    }
});

// POST /api/notices — Admin add notice
router.post("/", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { title, content, type } = req.body;

        if (!title || !content || !type) {
            res.status(400).json({ success: false, error: "Title, content, and type are required." });
            return;
        }

        const newNotice = await db.notice.create({
            data: { title, content, type }
        });

        res.status(201).json({ success: true, data: newNotice });
    } catch (err) {
        console.error("[POST NOTICE]:", err);
        res.status(500).json({ success: false, error: "Failed to create notice." });
    }
});

// DELETE /api/notices/:id — Admin remove notice
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.notice.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Notice deleted." });
    } catch (err) {
        console.error("[DELETE NOTICE]:", err);
        res.status(500).json({ success: false, error: "Failed to delete notice." });
    }
});

export default router;
