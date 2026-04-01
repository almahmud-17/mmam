// ================================================================
// Route: /api/notices
// Manages school notices and announcements
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { CONTENT_EDITOR_ROLES } from "../lib/contentRoles";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";
import { noticeSchema, paginate } from "../validations/common";

const router = Router();

const editorAuth = [authenticate, requireRole(...CONTENT_EDITOR_ROLES)] as const;

// GET /api/notices — Public list (paginated)
router.get("/", cacheMiddleware(180), asyncHandler(async (req: Request, res: Response) => {
    const { take, skip } = paginate(req.query);

    const [notices, total] = await Promise.all([
        db.notice.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        db.notice.count(),
    ]);

    res.json({ success: true, data: notices, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// POST /api/notices — Admin & teacher
router.post("/", ...editorAuth, asyncHandler(async (req: Request, res: Response) => {
    const parsed = noticeSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { title, content, type } = parsed.data;
    const isAdmin = req.user?.role === ROLES.ADMIN;
    const featuredOnHome = isAdmin && Boolean(req.body.featuredOnHome);
    const floatOnHome = isAdmin && Boolean(req.body.floatOnHome);

    const newNotice = await db.notice.create({
        data: { title, content, type, featuredOnHome, floatOnHome },
    });

    invalidateCache("/api/notices");
    res.status(201).json({ success: true, data: newNotice });
}));

// PUT /api/notices/:id — Admin & teacher (home flags: admin only)
router.put("/:id", ...editorAuth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsed = noticeSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { title, content, type } = parsed.data;
    const isAdmin = req.user?.role === ROLES.ADMIN;

    const data: { title: string; content: string; type: string; featuredOnHome?: boolean; floatOnHome?: boolean } = {
        title, content, type,
    };
    if (isAdmin) {
        if (typeof req.body.featuredOnHome === "boolean") data.featuredOnHome = req.body.featuredOnHome;
        if (typeof req.body.floatOnHome === "boolean") data.floatOnHome = req.body.floatOnHome;
    }

    const updated = await db.notice.update({ where: { id: String(id) }, data });

    invalidateCache("/api/notices");
    res.json({ success: true, data: updated });
}));

// DELETE /api/notices/:id — Admin & teacher
router.delete("/:id", ...editorAuth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.notice.delete({ where: { id: String(id) } });
    invalidateCache("/api/notices");
    res.json({ success: true, message: "Notice deleted." });
}));

export default router;
