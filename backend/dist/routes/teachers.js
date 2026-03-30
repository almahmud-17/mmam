"use strict";
// ================================================================
// Route: /api/teachers
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const auth_2 = require("../middleware/auth");
const upload_1 = require("../lib/upload");
const router = (0, express_1.Router)();
// GET /api/teachers
router.get("/", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), async (_req, res) => {
    try {
        const teachers = await db_1.db.teacher.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true },
                },
                subjects: { include: { section: { include: { class: true } } } },
            },
        });
        res.json({ success: true, data: teachers });
    }
    catch (err) {
        console.error("[GET TEACHERS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch teachers." });
    }
});
// POST /api/teachers — Support photo upload
router.post("/", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), upload_1.upload.single("image"), async (req, res) => {
    try {
        const { name, email, password, phone, specialization, bio, qualifications, experience } = req.body;
        let photoUrl = req.body.photoUrl;
        if (req.file) {
            photoUrl = `/uploads/${req.file.filename}`;
        }
        if (!name || !email || !password) {
            res.status(400).json({ success: false, error: "name, email, and password are required." });
            return;
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: __unused_pw, ...safeUser } = newUser;
        res.status(201).json({ success: true, data: safeUser });
    }
    catch (err) {
        console.error("[POST TEACHER]:", err);
        res.status(500).json({ success: false, error: "Failed to create teacher." });
    }
});
// PUT /api/teachers/:id — Support photo upload
router.put("/:id", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), upload_1.upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, specialization, bio, qualifications, experience } = req.body;
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
        res.json({ success: true, message: "Teacher updated successfully." });
    }
    catch (err) {
        console.error("[PUT TEACHER]:", err);
        res.status(500).json({ success: false, error: "Failed to update teacher." });
    }
});
// DELETE /api/teachers/:id
router.delete("/:id", auth_2.authenticate, (0, auth_2.requireRole)(auth_1.ROLES.ADMIN), async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[DELETE TEACHER]: Attempting to delete teacher ID: ${id}`);
        const teacher = await db_1.db.teacher.findUnique({
            where: { id: String(id) },
            include: { user: true }
        });
        if (!teacher) {
            console.warn(`[DELETE TEACHER]: Teacher with ID ${id} not found.`);
            res.status(404).json({ success: false, error: "Teacher not found." });
            return;
        }
        // Explicitly set subjects to null before deleting the teacher
        await db_1.db.subject.updateMany({
            where: { teacherId: String(id) },
            data: { teacherId: null }
        });
        await db_1.db.user.delete({ where: { id: teacher.userId } });
        console.log(`[DELETE TEACHER]: Successfully deleted teacher and user: ${teacher.user.email}`);
        res.json({ success: true, message: "Teacher deleted successfully." });
    }
    catch (err) {
        console.error("[DELETE TEACHER ERROR]:", err);
        res.status(500).json({ success: false, error: "Deletion failed. They might have related data." });
    }
});
exports.default = router;
//# sourceMappingURL=teachers.js.map