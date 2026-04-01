// ================================================================
// Route: /api/routine
// Class routine / timetable entries
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";
import { routineSchema, paginate } from "../validations/common";

const router = Router();

// GET /api/routine — public routine (optionally filter by class/section/day, paginated)
router.get("/", cacheMiddleware(300), asyncHandler(async (req: Request, res: Response) => {
    const { className, section, day } = req.query;
    const { take, skip } = paginate(req.query);

    const where = {
        ...(className ? { className: String(className) } : {}),
        ...(section ? { section: String(section) } : {}),
        ...(day ? { dayOfWeek: String(day) } : {}),
    };

    const [entries, total] = await Promise.all([
        db.routineEntry.findMany({
            where,
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            take,
            skip,
        }),
        db.routineEntry.count({ where }),
    ]);

    res.json({ success: true, data: entries, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// POST /api/routine — admin create entry
router.post("/", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const parsed = routineSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { className, section, dayOfWeek, startTime, endTime, subject, teacherName, room } = parsed.data;

    const created = await db.routineEntry.create({
        data: {
            className, section, dayOfWeek, startTime, endTime, subject,
            teacherName: teacherName ?? "",
            room: room ?? null,
        },
    });

    invalidateCache("/api/routine");
    res.status(201).json({ success: true, data: created });
}));

// PUT /api/routine/:id — admin update
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsed = routineSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { className, section, dayOfWeek, startTime, endTime, subject, teacherName, room } = parsed.data;

    const updated = await db.routineEntry.update({
        where: { id: String(id) },
        data: {
            className, section, dayOfWeek, startTime, endTime, subject,
            teacherName: teacherName ?? "",
            room: room ?? null,
        },
    });

    invalidateCache("/api/routine");
    res.json({ success: true, data: updated });
}));

// DELETE /api/routine/:id — admin delete
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.routineEntry.delete({ where: { id: String(id) } });
    invalidateCache("/api/routine");
    res.json({ success: true, message: "Routine entry deleted." });
}));

export default router;
