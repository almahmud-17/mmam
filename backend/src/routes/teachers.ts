// ================================================================
// Route: /api/teachers
// Includes featured teachers public endpoint
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { hashPassword, ROLES } from "../lib/auth";
import { authenticate, requireRole } from "../middleware/auth";
import { upload } from "../lib/upload";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";
import { createTeacherSchema, updateTeacherSchema } from "../validations/teacher";
import { paginate } from "../validations/common";

const router = Router();

// GET /api/teachers/featured — PUBLIC endpoint for homepage
router.get("/featured", cacheMiddleware(300), asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const teachers = await db.teacher.findMany({
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

// GET /api/teachers/public — PUBLIC endpoint for public faculties page
router.get("/public", cacheMiddleware(300), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { take, skip } = paginate(req.query);

    const [teachers, total] = await Promise.all([
        db.teacher.findMany({
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
            take,
            skip,
        }),
        db.teacher.count(),
    ]);

    res.json({ success: true, data: teachers, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// GET /api/teachers — paginated, admin only
router.get("/", authenticate, requireRole(ROLES.ADMIN), cacheMiddleware(120), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { take, skip } = paginate(req.query);

    const [teachers, total] = await Promise.all([
        db.teacher.findMany({
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
        db.teacher.count(),
    ]);

    res.json({ success: true, data: teachers, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// POST /api/teachers — Support photo upload
router.post("/", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parsed = createTeacherSchema.safeParse(req.body);
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

    invalidateCache("/api/teachers");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __unused_pw, ...safeUser } = newUser;
    res.status(201).json({ success: true, data: safeUser });
}));

// PUT /api/teachers/:id/featured — Toggle featured status
router.put("/:id/featured", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const teacher = await db.teacher.findUnique({ where: { id: String(id) } });
    if (!teacher) {
        res.status(404).json({ success: false, error: "Teacher not found." });
        return;
    }

    const updated = await db.teacher.update({
        where: { id: String(id) },
        data: { isFeatured: !teacher.isFeatured },
        select: { id: true, isFeatured: true },
    });

    invalidateCache("/api/teachers");
    res.json({ success: true, data: updated, message: updated.isFeatured ? "Teacher featured on homepage." : "Teacher removed from homepage." });
}));

// PUT /api/teachers/:id — Support photo upload
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const parsed = updateTeacherSchema.safeParse(req.body);
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
                update: {
                    specialization:
                        specialization !== undefined ? (specialization ? String(specialization) : null) : undefined,
                    photoUrl: photoUrl !== undefined ? (photoUrl ? String(photoUrl) : null) : undefined,
                    bio: bio !== undefined ? (bio ? String(bio) : null) : undefined,
                    qualifications:
                        qualifications !== undefined ? (qualifications ? String(qualifications) : null) : undefined,
                    experience:
                        experience !== undefined ? (experience ? String(experience) : null) : undefined,
                },
            },
        },
    });

    invalidateCache("/api/teachers");
    res.json({ success: true, message: "Teacher updated successfully." });
}));

// DELETE /api/teachers/:id
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const teacher = await db.teacher.findUnique({
        where: { id: String(id) },
        select: { userId: true, user: { select: { email: true } } },
    });

    if (!teacher) {
        res.status(404).json({ success: false, error: "Teacher not found." });
        return;
    }

    // Explicitly set subjects to null before deleting the teacher
    await db.subject.updateMany({
        where: { teacherId: String(id) },
        data: { teacherId: null }
    });

    await db.user.delete({ where: { id: teacher.userId } });

    invalidateCache("/api/teachers");
    res.json({ success: true, message: "Teacher deleted successfully." });
}));

export default router;
