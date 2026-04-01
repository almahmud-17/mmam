"use strict";
// ================================================================
// Route: /api/admin
// Admin-only password management routes
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const auth_2 = require("../middleware/auth");
const auth_3 = require("../validations/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// All routes require admin authentication
router.use(auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN));
// POST /api/admin/change-password — Admin changes their own password
router.post("/change-password", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = auth_3.changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => e.message).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { currentPassword, newPassword } = parsed.data;
    const userId = req.user.userId;
    const user = await db_1.db.user.findUnique({ where: { id: userId } });
    if (!user) {
        res.status(404).json({ success: false, error: "User not found." });
        return;
    }
    const isValid = await (0, auth_1.verifyPassword)(currentPassword, user.password);
    if (!isValid) {
        res.status(401).json({ success: false, error: "Current password is incorrect." });
        return;
    }
    const hashedPassword = await (0, auth_1.hashPassword)(newPassword);
    await db_1.db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    res.json({ success: true, message: "Password changed successfully." });
}));
// POST /api/admin/teachers/:id/reset-password — Reset a teacher's password
router.post("/teachers/:id/reset-password", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = auth_3.resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => e.message).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { id } = req.params;
    const { newPassword } = parsed.data;
    const teacher = await db_1.db.teacher.findUnique({
        where: { id: String(id) },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!teacher) {
        res.status(404).json({ success: false, error: "Teacher not found." });
        return;
    }
    const hashedPassword = await (0, auth_1.hashPassword)(newPassword);
    await db_1.db.user.update({
        where: { id: teacher.userId },
        data: { password: hashedPassword },
    });
    res.json({
        success: true,
        message: `Password reset successfully for ${teacher.user.name}.`,
    });
}));
// POST /api/admin/students/:id/reset-password — Reset a student's password
router.post("/students/:id/reset-password", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = auth_3.resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => e.message).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { id } = req.params;
    const { newPassword } = parsed.data;
    const student = await db_1.db.student.findUnique({
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
    const hashedPassword = await (0, auth_1.hashPassword)(newPassword);
    await db_1.db.user.update({
        where: { id: student.userId },
        data: { password: hashedPassword },
    });
    res.json({
        success: true,
        message: `Password reset successfully for ${student.user.name}.`,
    });
}));
exports.default = router;
//# sourceMappingURL=admin.js.map