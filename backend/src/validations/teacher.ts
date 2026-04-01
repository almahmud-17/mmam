// ================================================================
// Zod Validation Schemas — Teacher
// ================================================================

import { z } from "zod";

export const createTeacherSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    phone: z.string().optional().nullable(),
    specialization: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    qualifications: z.string().optional().nullable(),
    experience: z.string().optional().nullable(),
});

export const updateTeacherSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters.").optional(),
    email: z.string().email("Invalid email address.").optional(),
    password: z.string().min(6, "Password must be at least 6 characters.").optional(),
    phone: z.string().optional().nullable(),
    specialization: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    qualifications: z.string().optional().nullable(),
    experience: z.string().optional().nullable(),
});
