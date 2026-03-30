// ================================================================
// Route: /api/notices
// Manages school notices and announcements
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { CONTENT_EDITOR_ROLES } from "../lib/contentRoles";

const router = Router();

const editorAuth = [authenticate, requireRole(...CONTENT_EDITOR_ROLES)] as const;

// GET /api/notices — Public list (newest first; client may sort featured/float)
router.get("/", async (_req: Request, res: Response) => {
    try {
        const notices = await db.notice.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: notices });
    } catch (err) {
        console.error("[GET NOTICES]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch notices." });
    }
});

// POST /api/notices — Admin & teacher
router.post("/", ...editorAuth, async (req: Request, res: Response) => {
    try {
        const { title, content, type } = req.body;
        const isAdmin = req.user?.role === ROLES.ADMIN;
        const featuredOnHome = isAdmin && Boolean(req.body.featuredOnHome);
        const floatOnHome = isAdmin && Boolean(req.body.floatOnHome);

        if (!title || !content || !type) {
            res.status(400).json({ success: false, error: "Title, content, and type are required." });
            return;
        }

        const newNotice = await db.notice.create({
            data: {
                title,
                content,
                type,
                featuredOnHome,
                floatOnHome,
            },
        });

        res.status(201).json({ success: true, data: newNotice });
    } catch (err) {
        console.error("[POST NOTICE]:", err);
        res.status(500).json({ success: false, error: "Failed to create notice." });
    }
});

// PUT /api/notices/:id — Admin & teacher (home flags: admin only)
router.put("/:id", ...editorAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, type } = req.body;
        const isAdmin = req.user?.role === ROLES.ADMIN;

        if (!title || !content || !type) {
            res.status(400).json({ success: false, error: "Title, content, and type are required." });
            return;
        }

        const data: { title: string; content: string; type: string; featuredOnHome?: boolean; floatOnHome?: boolean } = {
            title,
            content,
            type,
        };
        if (isAdmin) {
            if (typeof req.body.featuredOnHome === "boolean") data.featuredOnHome = req.body.featuredOnHome;
            if (typeof req.body.floatOnHome === "boolean") data.floatOnHome = req.body.floatOnHome;
        }

        const updated = await db.notice.update({
            where: { id: String(id) },
            data,
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("[PUT NOTICE]:", err);
        res.status(500).json({ success: false, error: "Failed to update notice." });
    }
});

// DELETE /api/notices/:id — Admin & teacher
router.delete("/:id", ...editorAuth, async (req: Request, res: Response) => {
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
