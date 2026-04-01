// ================================================================
// Zod Validation Schemas — Auth
// ================================================================

import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email or roll number is required."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});
