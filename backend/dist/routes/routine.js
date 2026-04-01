"use strict";
// ================================================================
// Route: /api/routine
// Class routine / timetable entries
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
// GET /api/routine — public routine (optionally filter by class/section/day, paginated)
router.get("/", (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { className, section, day } = req.query;
    const { take, skip } = (0, common_1.paginate)(req.query);
    const where = {
        ...(className ? { className: String(className) } : {}),
        ...(section ? { section: String(section) } : {}),
        ...(day ? { dayOfWeek: String(day) } : {}),
    };
    const [entries, total] = await Promise.all([
        db_1.db.routineEntry.findMany({
            where,
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            take,
            skip,
        }),
        db_1.db.routineEntry.count({ where }),
    ]);
    res.json({ success: true, data: entries, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));
// POST /api/routine — admin create entry
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = common_1.routineSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { className, section, dayOfWeek, startTime, endTime, subject, teacherName, room } = parsed.data;
    const created = await db_1.db.routineEntry.create({
        data: {
            className, section, dayOfWeek, startTime, endTime, subject,
            teacherName: teacherName ?? "",
            room: room ?? null,
        },
    });
    (0, cache_1.invalidateCache)("/api/routine");
    res.status(201).json({ success: true, data: created });
}));
// PUT /api/routine/:id — admin update
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const parsed = common_1.routineSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { className, section, dayOfWeek, startTime, endTime, subject, teacherName, room } = parsed.data;
    const updated = await db_1.db.routineEntry.update({
        where: { id: String(id) },
        data: {
            className, section, dayOfWeek, startTime, endTime, subject,
            teacherName: teacherName ?? "",
            room: room ?? null,
        },
    });
    (0, cache_1.invalidateCache)("/api/routine");
    res.json({ success: true, data: updated });
}));
// DELETE /api/routine/:id — admin delete
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await db_1.db.routineEntry.delete({ where: { id: String(id) } });
    (0, cache_1.invalidateCache)("/api/routine");
    res.json({ success: true, message: "Routine entry deleted." });
}));
exports.default = router;
//# sourceMappingURL=routine.js.map