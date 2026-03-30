// ================================================================
// Route: /api/routine
// Class routine / timetable entries
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";

const router = Router();

// GET /api/routine — public routine (optionally filter by class/section/day)
router.get("/", async (req: Request, res: Response) => {
    try {
        const { className, section, day } = req.query;

        const entries = await db.routineEntry.findMany({
            where: {
                ...(className ? { className: String(className) } : {}),
                ...(section ? { section: String(section) } : {}),
                ...(day ? { dayOfWeek: String(day) } : {}),
            },
            orderBy: [
                { dayOfWeek: "asc" },
                { startTime: "asc" },
            ],
        });

        res.json({ success: true, data: entries });
    } catch (err) {
        console.error("[GET ROUTINE]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch routine." });
    }
});

// POST /api/routine — admin create entry
router.post("/", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { className, section, dayOfWeek, startTime, endTime, subject, teacherName, room } =
            req.body;

        if (!className || !section || !dayOfWeek || !startTime || !endTime || !subject) {
            res.status(400).json({
                success: false,
                error: "Class, section, day, start time, end time and subject are required.",
            });
            return;
        }

        const created = await db.routineEntry.create({
            data: {
                className,
                section,
                dayOfWeek,
                startTime,
                endTime,
                subject,
                teacherName: teacherName ?? "",
                room: room ?? null,
            },
        });

        res.status(201).json({ success: true, data: created });
    } catch (err) {
        console.error("[POST ROUTINE]:", err);
        res.status(500).json({ success: false, error: "Failed to create routine entry." });
    }
});

// PUT /api/routine/:id — admin update
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { className, section, dayOfWeek, startTime, endTime, subject, teacherName, room } =
            req.body;

        if (!className || !section || !dayOfWeek || !startTime || !endTime || !subject) {
            res.status(400).json({
                success: false,
                error: "Class, section, day, start time, end time and subject are required.",
            });
            return;
        }

        const updated = await db.routineEntry.update({
            where: { id: String(id) },
            data: {
                className,
                section,
                dayOfWeek,
                startTime,
                endTime,
                subject,
                teacherName: teacherName ?? "",
                room: room ?? null,
            },
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("[PUT ROUTINE]:", err);
        res.status(500).json({ success: false, error: "Failed to update routine entry." });
    }
});

// DELETE /api/routine/:id — admin delete
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.routineEntry.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Routine entry deleted." });
    } catch (err) {
        console.error("[DELETE ROUTINE]:", err);
        res.status(500).json({ success: false, error: "Failed to delete routine entry." });
    }
});

export default router;

