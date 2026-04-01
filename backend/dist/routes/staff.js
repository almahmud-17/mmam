"use strict";
// ================================================================
// Route: /api/staff
// Public leadership/teacher profiles for landing pages
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const upload_1 = require("../lib/upload");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const common_1 = require("../validations/common");
const router = (0, express_1.Router)();
// GET /api/staff — Public list (head first, then by sortOrder, paginated)
router.get("/", (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { take, skip } = (0, common_1.paginate)(req.query);
    const [staff, total] = await Promise.all([
        db_1.db.staffProfile.findMany({
            orderBy: [{ isHead: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
            take,
            skip,
        }),
        db_1.db.staffProfile.count(),
    ]);
    res.json({ success: true, data: staff, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));
// GET /api/staff/:id — Single profile
router.get("/:id", (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const staff = await db_1.db.staffProfile.findUnique({ where: { id: String(id) } });
    if (!staff) {
        res.status(404).json({ success: false, error: "Profile not found." });
        return;
    }
    res.json({ success: true, data: staff });
}));
// POST /api/staff — Admin create with photo upload
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), upload_1.upload.single("image"), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = common_1.staffSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { name, role, bio, sortOrder } = parsed.data;
    let imageUrl = req.body.imageUrl;
    const isHead = String(req.body.isHead) === "true";
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }
    const created = await db_1.db.staffProfile.create({
        data: {
            name, role,
            bio: bio ?? null,
            imageUrl: imageUrl ?? null,
            isHead,
            sortOrder: !isNaN(Number(sortOrder)) ? Number(sortOrder) : 0,
        },
    });
    (0, cache_1.invalidateCache)("/api/staff");
    res.status(201).json({ success: true, data: created });
}));
// PUT /api/staff/:id — Admin update with photo upload
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), upload_1.upload.single("image"), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const parsed = common_1.staffSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { name, role, bio, sortOrder } = parsed.data;
    let imageUrl = req.body.imageUrl;
    const isHead = String(req.body.isHead) === "true";
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }
    const updated = await db_1.db.staffProfile.update({
        where: { id: String(id) },
        data: {
            name, role,
            bio: bio ?? null,
            imageUrl: imageUrl ?? null,
            isHead,
            sortOrder: !isNaN(Number(sortOrder)) ? Number(sortOrder) : 0,
        },
    });
    (0, cache_1.invalidateCache)("/api/staff");
    res.json({ success: true, data: updated });
}));
// DELETE /api/staff/:id — Admin delete
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await db_1.db.staffProfile.delete({ where: { id: String(id) } });
    (0, cache_1.invalidateCache)("/api/staff");
    res.json({ success: true, message: "Staff profile deleted." });
}));
exports.default = router;
//# sourceMappingURL=staff.js.map