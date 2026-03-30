"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const upload_1 = require("../lib/upload");
const router = (0, express_1.Router)();
// GET /api/gallery — Public list
router.get("/", async (_req, res) => {
    try {
        const items = await db_1.db.galleryItem.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.json({ success: true, data: items });
    }
    catch (err) {
        console.error("[GET GALLERY]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch gallery." });
    }
});
// POST /api/gallery — Admin add item with file upload
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), upload_1.upload.single("image"), async (req, res) => {
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
        const newItem = await db_1.db.galleryItem.create({
            data: { title, imageUrl, description }
        });
        res.status(201).json({ success: true, data: newItem });
    }
    catch (err) {
        console.error("[POST GALLERY]:", err);
        res.status(500).json({ success: false, error: "Failed to create gallery item." });
    }
});
// PUT /api/gallery/:id — Admin update item with file upload
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), upload_1.upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        let imageUrl = req.body.imageUrl;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }
        if (!title || !imageUrl) {
            res.status(400).json({ success: false, error: "Title and Image (file or URL) are required." });
            return;
        }
        const updated = await db_1.db.galleryItem.update({
            where: { id: String(id) },
            data: { title, imageUrl, description },
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error("[PUT GALLERY]:", err);
        res.status(500).json({ success: false, error: "Failed to update item." });
    }
});
// DELETE /api/gallery/:id — Admin remove item
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.db.galleryItem.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Gallery item deleted." });
    }
    catch (err) {
        console.error("[DELETE GALLERY]:", err);
        res.status(500).json({ success: false, error: "Failed to delete item." });
    }
});
exports.default = router;
//# sourceMappingURL=gallery.js.map