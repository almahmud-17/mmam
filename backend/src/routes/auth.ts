// ================================================================
// Route: /api/auth
// POST /api/auth/login
// POST /api/auth/register (admin only — for creating accounts)
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { verifyPassword, signToken } from "../lib/auth";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, error: "Email and password are required." });
            return;
        }

        const rawLogin = String(email).trim();
        const normalizedEmail = rawLogin.toLowerCase();

        let user = await db.user.findUnique({
            where: { email: normalizedEmail },
            include: {
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
                        include: {
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
    } catch (err) {
        console.error("[AUTH LOGIN]:", err);
        res.status(500).json({ success: false, error: "Internal server error." });
    }
});

// POST /api/auth/me — validate token & return current user
router.get("/me", async (req: Request, res: Response): Promise<void> => {
    try {
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
            include: {
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
    } catch (err) {
        console.error("[AUTH ME]:", err);
        res.status(500).json({ success: false, error: "Internal server error." });
    }
});

export default router;
