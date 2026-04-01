"use strict";
// ================================================================
// Route: /api/notices
// Manages school notices and announcements
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const contentRoles_1 = require("../lib/contentRoles");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const common_1 = require("../validations/common");
const router = (0, express_1.Router)();
const editorAuth = [auth_1.authenticate, (0, auth_1.requireRole)(...contentRoles_1.CONTENT_EDITOR_ROLES)];
// GET /api/notices — Public list (paginated)
router.get("/", (0, cache_1.cacheMiddleware)(180), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { take, skip } = (0, common_1.paginate)(req.query);
    const [notices, total] = await Promise.all([
        db_1.db.notice.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        db_1.db.notice.count(),
    ]);
    res.json({ success: true, data: notices, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));
// POST /api/notices — Admin & teacher
router.post("/", ...editorAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = common_1.noticeSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { title, content, type } = parsed.data;
    const isAdmin = req.user?.role === auth_2.ROLES.ADMIN;
    const featuredOnHome = isAdmin && Boolean(req.body.featuredOnHome);
    const floatOnHome = isAdmin && Boolean(req.body.floatOnHome);
    const newNotice = await db_1.db.notice.create({
        data: { title, content, type, featuredOnHome, floatOnHome },
    });
    (0, cache_1.invalidateCache)("/api/notices");
    res.status(201).json({ success: true, data: newNotice });
}));
// PUT /api/notices/:id — Admin & teacher (home flags: admin only)
router.put("/:id", ...editorAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const parsed = common_1.noticeSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { title, content, type } = parsed.data;
    const isAdmin = req.user?.role === auth_2.ROLES.ADMIN;
    const data = {
        title, content, type,
    };
    if (isAdmin) {
        if (typeof req.body.featuredOnHome === "boolean")
            data.featuredOnHome = req.body.featuredOnHome;
        if (typeof req.body.floatOnHome === "boolean")
            data.floatOnHome = req.body.floatOnHome;
    }
    const updated = await db_1.db.notice.update({ where: { id: String(id) }, data });
    (0, cache_1.invalidateCache)("/api/notices");
    res.json({ success: true, data: updated });
}));
// DELETE /api/notices/:id — Admin & teacher
router.delete("/:id", ...editorAuth, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await db_1.db.notice.delete({ where: { id: String(id) } });
    (0, cache_1.invalidateCache)("/api/notices");
    res.json({ success: true, message: "Notice deleted." });
}));
exports.default = router;
//# sourceMappingURL=notices.js.map