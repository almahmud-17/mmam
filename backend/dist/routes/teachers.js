"use strict";
// ================================================================
// Route: /api/teachers
// Includes featured teachers public endpoint
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const auth_2 = require("../middleware/auth");
const upload_1 = require("../lib/upload");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const teacher_1 = require("../validations/teacher");
const common_1 = require("../validations/common");
const router = (0, express_1.Router)();
// GET /api/teachers/featured — PUBLIC endpoint for homepage
router.get("/featured", (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const teachers = await db_1.db.teacher.findMany({
        where: { isFeatured: true },
        select: {
            id: true,
            specialization: true,
            photoUrl: true,
            bio: true,
            qualifications: true,
            experience: true,
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    res.json({ success: true, data: teachers });
}));
// GET /api/teachers — paginated, admin only
router.get("/", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), (0, cache_1.cacheMiddleware)(120), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { take, skip } = (0, common_1.paginate)(req.query);
    const [teachers, total] = await Promise.all([
        db_1.db.teacher.findMany({
            select: {
                id: true, specialization: true, photoUrl: true, bio: true,
                qualifications: true, experience: true, isFeatured: true,
                user: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true },
                },
                subjects: { select: { id: true, name: true, section: { select: { id: true, name: true, class: { select: { id: true, name: true } } } } } },
            },
            take,
            skip,
        }),
        db_1.db.teacher.count(),
    ]);
    res.json({ success: true, data: teachers, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));
// POST /api/teachers — Support photo upload
router.post("/", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), upload_1.upload.single("image"), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = teacher_1.createTeacherSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { name, email, password, phone, specialization, bio, qualifications, experience } = parsed.data;
    let photoUrl = req.body.photoUrl;
    if (req.file) {
        photoUrl = `/uploads/${req.file.filename}`;
    }
    const existing = await db_1.db.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
    if (existing) {
        res.status(409).json({ success: false, error: "A user with this email already exists." });
        return;
    }
    const hashedPw = await (0, auth_1.hashPassword)(String(password));
    const newUser = await db_1.db.user.create({
        data: {
            name: String(name).trim(),
            email: String(email).toLowerCase().trim(),
            password: hashedPw,
            role: auth_1.ROLES.TEACHER,
            phone: phone ? String(phone) : null,
            teacherProfile: {
                create: {
                    specialization: specialization ? String(specialization) : null,
                    photoUrl: photoUrl ? String(photoUrl) : null,
                    bio: bio ? String(bio) : null,
                    qualifications: qualifications ? String(qualifications) : null,
                    experience: experience ? String(experience) : null,
                },
            },
        },
        include: { teacherProfile: true },
    });
    (0, cache_1.invalidateCache)("/api/teachers");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __unused_pw, ...safeUser } = newUser;
    res.status(201).json({ success: true, data: safeUser });
}));
// PUT /api/teachers/:id/featured — Toggle featured status
router.put("/:id/featured", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const teacher = await db_1.db.teacher.findUnique({ where: { id: String(id) } });
    if (!teacher) {
        res.status(404).json({ success: false, error: "Teacher not found." });
        return;
    }
    const updated = await db_1.db.teacher.update({
        where: { id: String(id) },
        data: { isFeatured: !teacher.isFeatured },
        select: { id: true, isFeatured: true },
    });
    (0, cache_1.invalidateCache)("/api/teachers");
    res.json({ success: true, data: updated, message: updated.isFeatured ? "Teacher featured on homepage." : "Teacher removed from homepage." });
}));
// PUT /api/teachers/:id — Support photo upload
router.put("/:id", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), upload_1.upload.single("image"), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const parsed = teacher_1.updateTeacherSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { name, email, password, phone, specialization, bio, qualifications, experience } = parsed.data;
    let photoUrl = req.body.photoUrl;
    if (req.file) {
        photoUrl = `/uploads/${req.file.filename}`;
    }
    const teacher = await db_1.db.teacher.findUnique({ where: { id: String(id) }, include: { user: true } });
    if (!teacher) {
        res.status(404).json({ success: false, error: "Teacher not found." });
        return;
    }
    const updateData = {};
    if (name)
        updateData.name = String(name).trim();
    if (email) {
        const normalizedEmail = String(email).toLowerCase().trim();
        if (normalizedEmail !== teacher.user.email) {
            const existing = await db_1.db.user.findUnique({ where: { email: normalizedEmail } });
            if (existing) {
                res.status(409).json({ success: false, error: "A user with this email already exists." });
                return;
            }
            updateData.email = normalizedEmail;
        }
    }
    if (password)
        updateData.password = await (0, auth_1.hashPassword)(String(password));
    if (phone !== undefined)
        updateData.phone = phone ? String(phone) : null;
    await db_1.db.user.update({
        where: { id: teacher.userId },
        data: {
            ...updateData,
            teacherProfile: {
                update: {
                    specialization: specialization !== undefined ? (specialization ? String(specialization) : null) : undefined,
                    photoUrl: photoUrl !== undefined ? (photoUrl ? String(photoUrl) : null) : undefined,
                    bio: bio !== undefined ? (bio ? String(bio) : null) : undefined,
                    qualifications: qualifications !== undefined ? (qualifications ? String(qualifications) : null) : undefined,
                    experience: experience !== undefined ? (experience ? String(experience) : null) : undefined,
                },
            },
        },
    });
    (0, cache_1.invalidateCache)("/api/teachers");
    res.json({ success: true, message: "Teacher updated successfully." });
}));
// DELETE /api/teachers/:id
router.delete("/:id", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const teacher = await db_1.db.teacher.findUnique({
        where: { id: String(id) },
        select: { userId: true, user: { select: { email: true } } },
    });
    if (!teacher) {
        res.status(404).json({ success: false, error: "Teacher not found." });
        return;
    }
    // Explicitly set subjects to null before deleting the teacher
    await db_1.db.subject.updateMany({
        where: { teacherId: String(id) },
        data: { teacherId: null }
    });
    await db_1.db.user.delete({ where: { id: teacher.userId } });
    (0, cache_1.invalidateCache)("/api/teachers");
    res.json({ success: true, message: "Teacher deleted successfully." });
}));
exports.default = router;
//# sourceMappingURL=teachers.js.map