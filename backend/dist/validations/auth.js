"use strict";
// ================================================================
// Zod Validation Schemas — Auth
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, "Email or roll number is required."),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters."),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Current password is required."),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: zod_1.z.string().min(1, "Confirm password is required."),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});
exports.resetPasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: zod_1.z.string().min(1, "Confirm password is required."),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});
//# sourceMappingURL=auth.js.map