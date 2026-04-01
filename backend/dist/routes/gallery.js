"use strict";
// ================================================================
// Route: /api/gallery
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../lib/upload");
const contentRoles_1 = require("../lib/contentRoles");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const common_1 = require("../validations/common");
const router = (0, express_1.Router)();
const editorAuth = [auth_1.authenticate, (0, auth_1.requireRole)(...contentRoles_1.CONTENT_EDITOR_ROLES)];
// GET /api/gallery — Public list (paginated)
router.get("/", (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { take, skip } = (0, common_1.paginate)(req.query);
    const [items, total] = await Promise.all([
        db_1.db.galleryItem.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        db_1.db.galleryItem.count(),
    ]);
    res.json({ success: true, data: items, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));
// POST /api/gallery — Admin add item with file upload
router.post("/", ...editorAuth, upload_1.upload.single("image"), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { title, description } = req.body;
    let imageUrl = req.body.imageUrl;
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
    (0, cache_1.invalidateCache)("/api/gallery");
    res.status(201).json({ success: true, data: newItem });
}));
// PUT /api/gallery/:id — Admin update item with file upload
router.put("/:id", ...editorAuth, upload_1.upload.single("image"), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }
    const existing = await db_1.db.galleryItem.findUnique({ where: { id: String(id) } });
    if (!existing) {
        res.status(404).json({ success: false, error: "Item not found." });
        return;
    }
    const finalUrl = imageUrl?.trim() || existing.imageUrl;
    if (!title?.trim() || !finalUrl) {
        res.status(400).json({ success: false, error: "Title and image are required." });
        return;
    }
    const updated = await db_1.db.galleryItem.update({
        where: { id: String(id) },
        data: { title: title.trim(), imageUrl: finalUrl, description },
    });
    (0, cache_1.invalidateCache)("/api/gallery");
    res.json({ success: true, data: updated });
}));
// DELETE /api/gallery/:id — Admin remove item
router.delete("/:id", ...editorAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await db_1.db.galleryItem.delete({ where: { id: String(id) } });
    (0, cache_1.invalidateCache)("/api/gallery");
    res.json({ success: true, message: "Gallery item deleted." });
}));
exports.default = router;
//# sourceMappingURL=gallery.js.map