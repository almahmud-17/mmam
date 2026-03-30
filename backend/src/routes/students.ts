// ================================================================
// Route: /api/students
// GET    /api/students      → list all students (admin)
// POST   /api/students      → create new student (admin)
// DELETE /api/students/:id  → delete student (admin)
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { hashPassword, ROLES } from "../lib/auth";
import { authenticate, requireRole } from "../middleware/auth";
import { upload } from "../lib/upload";

const router = Router();

// GET /api/students
router.get("/", authenticate, requireRole(ROLES.ADMIN, ROLES.TEACHER), async (_req: Request, res: Response): Promise<void> => {
    try {
        const students = await db.student.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true },
                },
                section: { include: { class: true } },
            },
            orderBy: { rollNo: "asc" },
        });

        res.json({ success: true, data: students });
    } catch (err) {
        console.error("[GET STUDENTS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch students." });
    }
});

// POST /api/students — Support photo upload
router.post("/", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone, rollNo, sectionId } = req.body;
        let avatar = req.body.avatar;

        if (req.file) {
            avatar = `/uploads/${req.file.filename}`;
        }

        if (!name || !email || !password || !rollNo || !sectionId) {
            res.status(400).json({ success: false, error: "Missing required fields: name, email, password, rollNo, sectionId." });
            return;
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: __unused_pw, ...safeUser } = newUser;
        res.status(201).json({ success: true, data: safeUser });
    } catch (err) {
        console.error("[POST STUDENT]:", err);
        res.status(500).json({ success: false, error: "Failed to create student." });
    }
});

// PUT /api/students/:id — Support photo upload
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, rollNo, sectionId } = req.body;
        let avatar = req.body.avatar;

        if (req.file) {
            avatar = `/uploads/${req.file.filename}`;
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

        res.json({ success: true, message: "Student updated successfully." });
    } catch (err) {
        console.error("[PUT STUDENT]:", err);
        res.status(500).json({ success: false, error: "Failed to update student." });
    }
});

// DELETE /api/students/:id
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        console.log(`[DELETE STUDENT]: Attempting to delete student ID: ${id}`);

        const student = await db.student.findUnique({
            where: { id: String(id) },
            include: { user: true }
        });

        if (!student) {
            console.warn(`[DELETE STUDENT]: Student with ID ${id} not found.`);
            res.status(404).json({ success: false, error: "Student not found." });
            return;
        }

        // Deleting the user will cascade delete the Student profile
        await db.user.delete({ where: { id: student.userId } });
        console.log(`[DELETE STUDENT]: Successfully deleted student and user: ${student.user.email}`);

        res.json({ success: true, message: "Student deleted successfully." });
    } catch (err) {
        console.error("[DELETE STUDENT ERROR]:", err);
        res.status(500).json({ success: false, error: "Failed to delete student. They might have related data." });
    }
});

export default router;
