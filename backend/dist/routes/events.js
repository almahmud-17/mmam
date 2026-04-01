"use strict";
// ================================================================
// Route: /api/events
// School events / calendar items
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const common_1 = require("../validations/common");
const router = (0, express_1.Router)();
// GET /api/events — public upcoming events (paginated)
router.get("/", (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { take, skip } = (0, common_1.paginate)(req.query);
    const [events, total] = await Promise.all([
        db_1.db.event.findMany({
            orderBy: { date: "asc" },
            take,
            skip,
        }),
        db_1.db.event.count(),
    ]);
    res.json({ success: true, data: events, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));
// POST /api/events — admin create
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = common_1.eventSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { title, date, type, description, imageUrl } = parsed.data;
    const created = await db_1.db.event.create({
        data: {
            title,
            date: new Date(date),
            type,
            description: description ?? null,
            imageUrl: imageUrl ?? null,
        },
    });
    (0, cache_1.invalidateCache)("/api/events");
    res.status(201).json({ success: true, data: created });
}));
// PUT /api/events/:id — admin update
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const parsed = common_1.eventSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { title, date, type, description, imageUrl } = parsed.data;
    const updated = await db_1.db.event.update({
        where: { id: String(id) },
        data: {
            title,
            date: new Date(date),
            type,
            description: description ?? null,
            imageUrl: imageUrl ?? null,
        },
    });
    (0, cache_1.invalidateCache)("/api/events");
    res.json({ success: true, data: updated });
}));
// DELETE /api/events/:id — admin delete
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await db_1.db.event.delete({ where: { id: String(id) } });
    (0, cache_1.invalidateCache)("/api/events");
    res.json({ success: true, message: "Event deleted." });
}));
exports.default = router;
//# sourceMappingURL=events.js.map