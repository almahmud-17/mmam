// ================================================================
// Auth Utilities — SchoolSpace Backend
// ================================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
    if (password.length < 6) {
        return { valid: false, error: "Password must be at least 6 characters." };
    }
    return { valid: true };
}

// ─── JWT ───────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || "schoolspace_dev_secret_change_in_prod";

export interface JwtPayload {
    userId: string;
    role: string;
}

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

// ─── Role constants ────────────────────────────────────────────

export const ROLES = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
} as const;

export const ATTENDANCE_STATUS = {
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
    LATE: "LATE",
} as const;

export const NOTICE_TYPE = {
    GENERAL: "GENERAL",
    ACADEMIC: "ACADEMIC",
    EMERGENCY: "EMERGENCY",
} as const;

export const EXAM_TYPE = {
    CLASS_TEST: "CLASS_TEST",
    MID: "MID",
    FINAL: "FINAL",
} as const;
