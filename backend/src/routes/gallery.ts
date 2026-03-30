import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { upload } from "../lib/upload";
import { CONTENT_EDITOR_ROLES } from "../lib/contentRoles";

const router = Router();

const editorAuth = [authenticate, requireRole(...CONTENT_EDITOR_ROLES)] as const;

// GET /api/gallery — Public list
router.get("/", async (_req: Request, res: Response) => {
    try {
        const items = await db.galleryItem.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.json({ success: true, data: items });
    } catch (err) {
        console.error("[GET GALLERY]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch gallery." });
    }
});

// POST /api/gallery — Admin add item with file upload
router.post("/", ...editorAuth, upload.single("image"), async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        let imageUrl = req.body.imageUrl;

        // If a file was uploaded, use the file path instead of the URL
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

        res.status(201).json({ success: true, data: newItem });
    } catch (err) {
        console.error("[POST GALLERY]:", err);
        res.status(500).json({ success: false, error: "Failed to create gallery item." });
    }
});

// PUT /api/gallery/:id — Admin update item with file upload
router.put("/:id", ...editorAuth, upload.single("image"), async (req: Request, res: Response) => {
    try {
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
            res.status(400).json({ success: false, error: "Title and image (keep existing, new file, or URL) are required." });
            return;
        }

        const updated = await db.galleryItem.update({
            where: { id: String(id) },
            data: { title: title.trim(), imageUrl: finalUrl, description },
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("[PUT GALLERY]:", err);
        res.status(500).json({ success: false, error: "Failed to update item." });
    }
});

// DELETE /api/gallery/:id — Admin remove item
router.delete("/:id", ...editorAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.galleryItem.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Gallery item deleted." });
    } catch (err) {
        console.error("[DELETE GALLERY]:", err);
        res.status(500).json({ success: false, error: "Failed to delete item." });
    }
});

export default router;
