// ================================================================
// Route: /api/gallery
// Manages school gallery media
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";

const router = Router();

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

// POST /api/gallery — Admin add item
router.post("/", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { title, imageUrl, description } = req.body;

        if (!title || !imageUrl) {
            res.status(400).json({ success: false, error: "Title and Image URL are required." });
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

// DELETE /api/gallery/:id — Admin remove item
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
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
