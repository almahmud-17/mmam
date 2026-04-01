// ================================================================
// Route: /api/auth
// POST /api/auth/login
// GET  /api/auth/me
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { verifyPassword, signToken } from "../lib/auth";
import { loginSchema } from "../validations/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// POST /api/auth/login
router.post("/login", asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => e.message).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { email, password } = parsed.data;
    const rawLogin = String(email).trim();
    const normalizedEmail = rawLogin.toLowerCase();

    let user = await db.user.findUnique({
        where: { email: normalizedEmail },
        select: {
            id: true, email: true, password: true, name: true, role: true,
            phone: true, avatar: true,
            studentProfile: { select: { id: true } },
            teacherProfile: { select: { id: true } },
        },
    });

    // Students may sign in with roll number if it is unique in the database
    if (!user && /^\d+$/.test(rawLogin)) {
        const rollNo = parseInt(rawLogin, 10);
        const student = await db.student.findFirst({
            where: { rollNo },
            include: {
                user: {
                    select: {
                        id: true, email: true, password: true, name: true, role: true,
                        phone: true, avatar: true,
                        studentProfile: { select: { id: true } },
                        teacherProfile: { select: { id: true } },
                    },
                },
            },
        });
        if (student?.user) {
            user = student.user;
        }
    }

    if (!user) {
        res.status(401).json({ success: false, error: "Invalid credentials." });
        return;
    }

    const isValid = await verifyPassword(String(password), user.password);
    if (!isValid) {
        res.status(401).json({ success: false, error: "Invalid credentials." });
        return;
    }

    // Build token + safe user
    const token = signToken({ userId: user.id, role: user.role });

    const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        studentProfileId: user.studentProfile?.id ?? null,
        teacherProfileId: user.teacherProfile?.id ?? null,
    };

    res.json({ success: true, token, user: safeUser });
}));

// GET /api/auth/me — validate token & return current user
router.get("/me", asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "No token." });
        return;
    }

    const { verifyToken } = await import("../lib/auth");
    const payload = verifyToken(authHeader.split(" ")[1]);
    if (!payload) {
        res.status(401).json({ success: false, error: "Invalid token." });
        return;
    }

    const user = await db.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true, email: true, name: true, role: true,
            phone: true, avatar: true,
            studentProfile: { select: { id: true } },
            teacherProfile: { select: { id: true } },
        },
    });

    if (!user) {
        res.status(404).json({ success: false, error: "User not found." });
        return;
    }

    const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        studentProfileId: user.studentProfile?.id ?? null,
        teacherProfileId: user.teacherProfile?.id ?? null,
    };

    res.json({ success: true, user: safeUser });
}));

export default router;
