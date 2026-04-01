// ================================================================
// Route: /api/gallery
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { upload } from "../lib/upload";
import { CONTENT_EDITOR_ROLES } from "../lib/contentRoles";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";
import { paginate } from "../validations/common";

const router = Router();

const editorAuth = [authenticate, requireRole(...CONTENT_EDITOR_ROLES)] as const;

// GET /api/gallery — Public list (paginated)
router.get("/", cacheMiddleware(300), asyncHandler(async (req: Request, res: Response) => {
    const { take, skip } = paginate(req.query);

    const [items, total] = await Promise.all([
        db.galleryItem.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        db.galleryItem.count(),
    ]);

    res.json({ success: true, data: items, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// POST /api/gallery — Admin add item with file upload
router.post("/", ...editorAuth, upload.single("image"), asyncHandler(async (req: Request, res: Response) => {
    const { title, description } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !imageUrl) {
        res.status(400).json({ success: false, error: "Title and Image (file or URL) are required." });
        return;
    }

    const newItem = await db.galleryItem.create({
        data: { title, imageUrl, description }
    });

    invalidateCache("/api/gallery");
    res.status(201).json({ success: true, data: newItem });
}));

// PUT /api/gallery/:id — Admin update item with file upload
router.put("/:id", ...editorAuth, upload.single("image"), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;
    let imageUrl = req.body.imageUrl as string | undefined;

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    const existing = await db.galleryItem.findUnique({ where: { id: String(id) } });
    if (!existing) {
        res.status(404).json({ success: false, error: "Item not found." });
        return;
    }

    const finalUrl = imageUrl?.trim() || existing.imageUrl;
    if (!title?.trim() || !finalUrl) {
        res.status(400).json({ success: false, error: "Title and image are required." });
        return;
    }

    const updated = await db.galleryItem.update({
        where: { id: String(id) },
        data: { title: title.trim(), imageUrl: finalUrl, description },
    });

    invalidateCache("/api/gallery");
    res.json({ success: true, data: updated });
}));

// DELETE /api/gallery/:id — Admin remove item
router.delete("/:id", ...editorAuth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.galleryItem.delete({ where: { id: String(id) } });
    invalidateCache("/api/gallery");
    res.json({ success: true, message: "Gallery item deleted." });
}));

export default router;
