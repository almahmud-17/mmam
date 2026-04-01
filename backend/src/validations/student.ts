// ================================================================
// Zod Validation Schemas — Student
// ================================================================

import { z } from "zod";

export const createStudentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    phone: z.string().optional().nullable(),
    rollNo: z.coerce.number().int().positive("Roll number must be positive."),
    sectionId: z.string().uuid("Invalid section ID."),
});

export const updateStudentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters.").optional(),
    email: z.string().email("Invalid email address.").optional(),
    password: z.string().min(6, "Password must be at least 6 characters.").optional(),
    phone: z.string().optional().nullable(),
    rollNo: z.coerce.number().int().positive("Roll number must be positive.").optional(),
    sectionId: z.string().uuid("Invalid section ID.").optional(),
});
