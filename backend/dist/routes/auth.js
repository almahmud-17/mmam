"use strict";
// ================================================================
// Route: /api/auth
// POST /api/auth/login
// POST /api/auth/register (admin only — for creating accounts)
// ================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, error: "Email and password are required." });
            return;
        }
        const user = await db_1.db.user.findUnique({
            where: { email: String(email).toLowerCase().trim() },
            include: {
                studentProfile: { select: { id: true } },
                teacherProfile: { select: { id: true } },
            },
        });
        if (!user) {
            res.status(401).json({ success: false, error: "Invalid credentials." });
            return;
        }
        const isValid = await (0, auth_1.verifyPassword)(String(password), user.password);
        if (!isValid) {
            res.status(401).json({ success: false, error: "Invalid credentials." });
            return;
        }
        // Build token + safe user
        const token = (0, auth_1.signToken)({ userId: user.id, role: user.role });
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
    }
    catch (err) {
        console.error("[AUTH LOGIN]:", err);
        res.status(500).json({ success: false, error: "Internal server error." });
    }
});
// POST /api/auth/me — validate token & return current user
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ success: false, error: "No token." });
            return;
        }
        const { verifyToken } = await Promise.resolve().then(() => __importStar(require("../lib/auth")));
        const payload = verifyToken(authHeader.split(" ")[1]);
        if (!payload) {
            res.status(401).json({ success: false, error: "Invalid token." });
            return;
        }
        const user = await db_1.db.user.findUnique({
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
    }
    catch (err) {
        console.error("[AUTH ME]:", err);
        res.status(500).json({ success: false, error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map