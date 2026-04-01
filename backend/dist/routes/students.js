"use strict";
// ================================================================
// Route: /api/students
// GET    /api/students      → list (paginated)
// POST   /api/students      → create new student (admin)
// PUT    /api/students/:id  → update student (admin)
// DELETE /api/students/:id  → delete student (admin)
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const auth_2 = require("../middleware/auth");
const upload_1 = require("../lib/upload");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const student_1 = require("../validations/student");
const common_1 = require("../validations/common");
const router = (0, express_1.Router)();
// GET /api/students — paginated
router.get("/", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN, auth_1.ROLES.TEACHER), (0, cache_1.cacheMiddleware)(120), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { take, skip } = (0, common_1.paginate)(req.query);
    const [students, total] = await Promise.all([
        db_1.db.student.findMany({
            select: {
                id: true, rollNo: true, sectionId: true,
                user: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true },
                },
                section: { select: { id: true, name: true, class: { select: { id: true, name: true } } } },
            },
            orderBy: { rollNo: "asc" },
            take,
            skip,
        }),
        db_1.db.student.count(),
    ]);
    res.json({ success: true, data: students, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));
// POST /api/students — Support photo upload
router.post("/", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), upload_1.upload.single("image"), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = student_1.createStudentSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { name, email, password, phone, rollNo, sectionId } = parsed.data;
    let avatar = req.body.avatar;
    if (req.file) {
        avatar = `/uploads/${req.file.filename}`;
    }
    const existing = await db_1.db.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
    if (existing) {
        res.status(409).json({ success: false, error: "A user with this email already exists." });
        return;
    }
    const existingRoll = await db_1.db.student.findFirst({
        where: { rollNo: Number(rollNo), sectionId: String(sectionId) },
    });
    if (existingRoll) {
        res.status(409).json({ success: false, error: "Roll number already taken in this section." });
        return;
    }
    const hashedPw = await (0, auth_1.hashPassword)(String(password));
    const newUser = await db_1.db.user.create({
        data: {
            name: String(name).trim(),
            email: String(email).toLowerCase().trim(),
            password: hashedPw,
            role: auth_1.ROLES.STUDENT,
            phone: phone ? String(phone) : null,
            avatar: avatar ? String(avatar) : null,
            studentProfile: {
                create: { rollNo: Number(rollNo), sectionId: String(sectionId) },
            },
        },
        include: {
            studentProfile: { include: { section: { include: { class: true } } } },
        },
    });
    (0, cache_1.invalidateCache)("/api/students");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __unused_pw, ...safeUser } = newUser;
    res.status(201).json({ success: true, data: safeUser });
}));
// PUT /api/students/:id — Support photo upload
router.put("/:id", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), upload_1.upload.single("image"), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const parsed = student_1.updateStudentSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { name, email, password, phone, rollNo, sectionId } = parsed.data;
    let avatar = req.body.avatar;
    if (req.file) {
        avatar = `/uploads/${req.file.filename}`;
    }
    const student = await db_1.db.student.findUnique({ where: { id: String(id) }, include: { user: true } });
    if (!student) {
        res.status(404).json({ success: false, error: "Student not found." });
        return;
    }
    const userUpdate = {};
    if (name)
        userUpdate.name = String(name).trim();
    if (email) {
        const normalizedEmail = String(email).toLowerCase().trim();
        if (normalizedEmail !== student.user.email) {
            const existing = await db_1.db.user.findUnique({ where: { email: normalizedEmail } });
            if (existing) {
                res.status(409).json({ success: false, error: "A user with this email already exists." });
                return;
            }
            userUpdate.email = normalizedEmail;
        }
    }
    if (password)
        userUpdate.password = await (0, auth_1.hashPassword)(String(password));
    if (phone !== undefined)
        userUpdate.phone = phone ? String(phone) : null;
    if (avatar !== undefined)
        userUpdate.avatar = avatar ? String(avatar) : null;
    const profileUpdate = {};
    if (rollNo !== undefined)
        profileUpdate.rollNo = Number(rollNo);
    if (sectionId)
        profileUpdate.sectionId = String(sectionId);
    // Check roll uniqueness if roll or section changed
    if (profileUpdate.rollNo !== undefined || profileUpdate.sectionId) {
        const finalRoll = profileUpdate.rollNo ?? student.rollNo;
        const finalSecId = profileUpdate.sectionId ?? student.sectionId;
        if (finalRoll !== student.rollNo || finalSecId !== student.sectionId) {
            const existingRoll = await db_1.db.student.findFirst({
                where: { rollNo: finalRoll, sectionId: finalSecId },
            });
            if (existingRoll) {
                res.status(409).json({ success: false, error: "Roll number already taken in this section." });
                return;
            }
        }
    }
    await db_1.db.user.update({
        where: { id: student.userId },
        data: {
            ...userUpdate,
            studentProfile: { update: profileUpdate }
        }
    });
    (0, cache_1.invalidateCache)("/api/students");
    res.json({ success: true, message: "Student updated successfully." });
}));
// DELETE /api/students/:id
router.delete("/:id", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const student = await db_1.db.student.findUnique({
        where: { id: String(id) },
        select: { userId: true, user: { select: { email: true } } },
    });
    if (!student) {
        res.status(404).json({ success: false, error: "Student not found." });
        return;
    }
    // Deleting the user will cascade delete the Student profile
    await db_1.db.user.delete({ where: { id: student.userId } });
    (0, cache_1.invalidateCache)("/api/students");
    res.json({ success: true, message: "Student deleted successfully." });
}));
exports.default = router;
//# sourceMappingURL=students.js.map