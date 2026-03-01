// ================================================================
// Route: /api/teachers
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { hashPassword, ROLES } from "../lib/auth";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/teachers
router.get("/", authenticate, requireRole(ROLES.ADMIN), async (_req: Request, res: Response): Promise<void> => {
    try {
        const teachers = await db.teacher.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true },
                },
                subjects: { include: { section: { include: { class: true } } } },
            },
        });

        res.json({ success: true, data: teachers });
    } catch (err) {
        console.error("[GET TEACHERS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch teachers." });
    }
});

// POST /api/teachers
router.post("/", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone, specialization } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ success: false, error: "name, email, and password are required." });
            return;
        }

        const existing = await db.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
        if (existing) {
            res.status(409).json({ success: false, error: "A user with this email already exists." });
            return;
        }

        const hashedPw = await hashPassword(String(password));

        const newUser = await db.user.create({
            data: {
                name: String(name).trim(),
                email: String(email).toLowerCase().trim(),
                password: hashedPw,
                role: ROLES.TEACHER,
                phone: phone ? String(phone) : null,
                teacherProfile: {
                    create: { specialization: specialization ? String(specialization) : null },
                },
            },
            include: { teacherProfile: true },
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: __unused_pw, ...safeUser } = newUser;
        res.status(201).json({ success: true, data: safeUser });
    } catch (err) {
        console.error("[POST TEACHER]:", err);
        res.status(500).json({ success: false, error: "Failed to create teacher." });
    }
});

// PUT /api/teachers/:id
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, specialization } = req.body;

        const teacher = await db.teacher.findUnique({ where: { id: String(id) }, include: { user: true } });
        if (!teacher) {
            res.status(404).json({ success: false, error: "Teacher not found." });
            return;
        }

        const updateData: any = {};
        if (name) updateData.name = String(name).trim();
        if (email) {
            const normalizedEmail = String(email).toLowerCase().trim();
            if (normalizedEmail !== teacher.user.email) {
                const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
                if (existing) {
                    res.status(409).json({ success: false, error: "A user with this email already exists." });
                    return;
                }
                updateData.email = normalizedEmail;
            }
        }
        if (password) updateData.password = await hashPassword(String(password));
        if (phone !== undefined) updateData.phone = phone ? String(phone) : null;

        await db.user.update({
            where: { id: teacher.userId },
            data: {
                ...updateData,
                teacherProfile: {
                    update: { specialization: specialization !== undefined ? (specialization ? String(specialization) : null) : undefined }
                }
            }
        });

        res.json({ success: true, message: "Teacher updated successfully." });
    } catch (err) {
        console.error("[PUT TEACHER]:", err);
        res.status(500).json({ success: false, error: "Failed to update teacher." });
    }
});

// DELETE /api/teachers/:id
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        console.log(`[DELETE TEACHER]: Attempting to delete teacher ID: ${id}`);

        const teacher = await db.teacher.findUnique({
            where: { id: String(id) },
            include: { user: true }
        });

        if (!teacher) {
            console.warn(`[DELETE TEACHER]: Teacher with ID ${id} not found.`);
            res.status(404).json({ success: false, error: "Teacher not found." });
            return;
        }

        // Explicitly set subjects to null before deleting the teacher
        await db.subject.updateMany({
            where: { teacherId: String(id) },
            data: { teacherId: null }
        });

        await db.user.delete({ where: { id: teacher.userId } });
        console.log(`[DELETE TEACHER]: Successfully deleted teacher and user: ${teacher.user.email}`);

        res.json({ success: true, message: "Teacher deleted successfully." });
    } catch (err) {
        console.error("[DELETE TEACHER ERROR]:", err);
        res.status(500).json({ success: false, error: "Deletion failed. They might have related data." });
    }
});

export default router;
