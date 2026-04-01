// ================================================================
// Route: /api/admin
// Admin-only password management routes
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { hashPassword, verifyPassword, ROLES } from "../lib/auth";
import { authenticate, requireRole } from "../middleware/auth";
import { changePasswordSchema, resetPasswordSchema } from "../validations/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// All routes require admin authentication
router.use(authenticate, requireRole(ROLES.ADMIN));

// POST /api/admin/change-password — Admin changes their own password
router.post("/change-password", asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => e.message).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { currentPassword, newPassword } = parsed.data;
    const userId = req.user!.userId;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
        res.status(404).json({ success: false, error: "User not found." });
        return;
    }

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
        res.status(401).json({ success: false, error: "Current password is incorrect." });
        return;
    }

    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    res.json({ success: true, message: "Password changed successfully." });
}));

// POST /api/admin/teachers/:id/reset-password — Reset a teacher's password
router.post("/teachers/:id/reset-password", asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => e.message).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { id } = req.params;
    const { newPassword } = parsed.data;

    const teacher = await db.teacher.findUnique({
        where: { id: String(id) },
        include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!teacher) {
        res.status(404).json({ success: false, error: "Teacher not found." });
        return;
    }

    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({
        where: { id: teacher.userId },
        data: { password: hashedPassword },
    });

    res.json({
        success: true,
        message: `Password reset successfully for ${teacher.user.name}.`,
    });
}));

// POST /api/admin/students/:id/reset-password — Reset a student's password
router.post("/students/:id/reset-password", asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => e.message).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { id } = req.params;
    const { newPassword } = parsed.data;

    const student = await db.student.findUnique({
        where: { id: String(id) },
        include: {
            user: { select: { id: true, name: true, email: true } },
            section: { include: { class: true } },
        },
    });

    if (!student) {
        res.status(404).json({ success: false, error: "Student not found." });
        return;
    }

    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({
        where: { id: student.userId },
        data: { password: hashedPassword },
    });

    res.json({
        success: true,
        message: `Password reset successfully for ${student.user.name}.`,
    });
}));

export default router;
