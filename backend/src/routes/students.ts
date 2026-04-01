// ================================================================
// Route: /api/students
// GET    /api/students      → list (paginated)
// POST   /api/students      → create new student (admin)
// PUT    /api/students/:id  → update student (admin)
// DELETE /api/students/:id  → delete student (admin)
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { hashPassword, ROLES } from "../lib/auth";
import { authenticate, requireRole } from "../middleware/auth";
import { upload } from "../lib/upload";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";
import { createStudentSchema, updateStudentSchema } from "../validations/student";
import { paginate } from "../validations/common";

const router = Router();

// GET /api/students — paginated
router.get("/", authenticate, requireRole(ROLES.ADMIN, ROLES.TEACHER), cacheMiddleware(120), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { take, skip } = paginate(req.query);

    const [students, total] = await Promise.all([
        db.student.findMany({
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
        db.student.count(),
    ]);

    res.json({ success: true, data: students, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// POST /api/students — Support photo upload
router.post("/", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parsed = createStudentSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { name, email, password, phone, rollNo, sectionId } = parsed.data;
    let avatar = req.body.avatar;

    if (req.file) {
        avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const existing = await db.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
    if (existing) {
        res.status(409).json({ success: false, error: "A user with this email already exists." });
        return;
    }

    const existingRoll = await db.student.findFirst({
        where: { rollNo: Number(rollNo), sectionId: String(sectionId) },
    });
    if (existingRoll) {
        res.status(409).json({ success: false, error: "Roll number already taken in this section." });
        return;
    }

    const hashedPw = await hashPassword(String(password));

    const newUser = await db.user.create({
        data: {
            name: String(name).trim(),
            email: String(email).toLowerCase().trim(),
            password: hashedPw,
            role: ROLES.STUDENT,
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

    invalidateCache("/api/students");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __unused_pw, ...safeUser } = newUser;
    res.status(201).json({ success: true, data: safeUser });
}));

// PUT /api/students/:id — Support photo upload
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const parsed = updateStudentSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { name, email, password, phone, rollNo, sectionId } = parsed.data;
    let avatar = req.body.avatar;

    if (req.file) {
        avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const student = await db.student.findUnique({ where: { id: String(id) }, include: { user: true } });
    if (!student) {
        res.status(404).json({ success: false, error: "Student not found." });
        return;
    }

    const userUpdate: any = {};
    if (name) userUpdate.name = String(name).trim();
    if (email) {
        const normalizedEmail = String(email).toLowerCase().trim();
        if (normalizedEmail !== student.user.email) {
            const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
            if (existing) {
                res.status(409).json({ success: false, error: "A user with this email already exists." });
                return;
            }
            userUpdate.email = normalizedEmail;
        }
    }
    if (password) userUpdate.password = await hashPassword(String(password));
    if (phone !== undefined) userUpdate.phone = phone ? String(phone) : null;
    if (avatar !== undefined) userUpdate.avatar = avatar ? String(avatar) : null;

    const profileUpdate: any = {};
    if (rollNo !== undefined) profileUpdate.rollNo = Number(rollNo);
    if (sectionId) profileUpdate.sectionId = String(sectionId);

    // Check roll uniqueness if roll or section changed
    if (profileUpdate.rollNo !== undefined || profileUpdate.sectionId) {
        const finalRoll = profileUpdate.rollNo ?? student.rollNo;
        const finalSecId = profileUpdate.sectionId ?? student.sectionId;

        if (finalRoll !== student.rollNo || finalSecId !== student.sectionId) {
            const existingRoll = await db.student.findFirst({
                where: { rollNo: finalRoll, sectionId: finalSecId },
            });
            if (existingRoll) {
                res.status(409).json({ success: false, error: "Roll number already taken in this section." });
                return;
            }
        }
    }

    await db.user.update({
        where: { id: student.userId },
        data: {
            ...userUpdate,
            studentProfile: { update: profileUpdate }
        }
    });

    invalidateCache("/api/students");
    res.json({ success: true, message: "Student updated successfully." });
}));

// DELETE /api/students/:id
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const student = await db.student.findUnique({
        where: { id: String(id) },
        select: { userId: true, user: { select: { email: true } } },
    });

    if (!student) {
        res.status(404).json({ success: false, error: "Student not found." });
        return;
    }

    // Deleting the user will cascade delete the Student profile
    await db.user.delete({ where: { id: student.userId } });

    invalidateCache("/api/students");
    res.json({ success: true, message: "Student deleted successfully." });
}));

export default router;
