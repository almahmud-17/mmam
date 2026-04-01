// ================================================================
// Zod Validation Schemas — Common / Shared
// ================================================================

import { z } from "zod";

/** Pagination query params — use with req.query */
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/** Helper to extract take/skip from pagination */
export function paginate(query: Record<string, any>): { take: number; skip: number } {
    const parsed = paginationSchema.safeParse(query);
    const page = parsed.success ? parsed.data.page : 1;
    const limit = parsed.success ? parsed.data.limit : 50;
    return { take: limit, skip: (page - 1) * limit };
}

/** UUID validator */
export const uuidSchema = z.string().uuid("Invalid UUID.");

/** Contact form validation */
export const contactSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
    message: z.string().min(1, "Message is required."),
});

/** Notice validation */
export const noticeSchema = z.object({
    title: z.string().min(1, "Title is required."),
    content: z.string().min(1, "Content is required."),
    type: z.string().min(1, "Type is required."),
    featuredOnHome: z.boolean().optional(),
    floatOnHome: z.boolean().optional(),
});

/** Event validation */
export const eventSchema = z.object({
    title: z.string().min(1, "Title is required."),
    date: z.string().min(1, "Date is required."),
    type: z.string().min(1, "Type is required."),
    description: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
});

/** Routine entry validation */
export const routineSchema = z.object({
    className: z.string().min(1, "Class name is required."),
    section: z.string().min(1, "Section is required."),
    dayOfWeek: z.string().min(1, "Day of week is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    subject: z.string().min(1, "Subject is required."),
    teacherName: z.string().optional().default(""),
    room: z.string().optional().nullable(),
});

/** Gallery item validation */
export const gallerySchema = z.object({
    title: z.string().min(1, "Title is required."),
    imageUrl: z.string().optional(),
    description: z.string().optional().nullable(),
});

/** Staff profile validation */
export const staffSchema = z.object({
    name: z.string().min(1, "Name is required."),
    role: z.string().min(1, "Role is required."),
    bio: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    isHead: z.any().optional(),
    sortOrder: z.coerce.number().optional().default(0),
});
