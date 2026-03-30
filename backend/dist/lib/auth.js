"use strict";
// ================================================================
// Auth Utilities — SchoolSpace Backend
// ================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXAM_TYPE = exports.NOTICE_TYPE = exports.ATTENDANCE_STATUS = exports.ROLES = void 0;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.validatePassword = validatePassword;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 10;
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hashedPassword) {
    return bcryptjs_1.default.compare(password, hashedPassword);
}
function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, error: "Password must be at least 6 characters." };
    }
    return { valid: true };
}
// ─── JWT ───────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "schoolspace_dev_secret_change_in_prod";
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
// ─── Role constants ────────────────────────────────────────────
exports.ROLES = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
};
exports.ATTENDANCE_STATUS = {
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
    LATE: "LATE",
};
exports.NOTICE_TYPE = {
    GENERAL: "GENERAL",
    ACADEMIC: "ACADEMIC",
    EMERGENCY: "EMERGENCY",
};
exports.EXAM_TYPE = {
    CLASS_TEST: "CLASS_TEST",
    MID: "MID",
    FINAL: "FINAL",
};
//# sourceMappingURL=auth.js.map