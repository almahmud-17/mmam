"use strict";
// ================================================================
// Zod Validation Schemas — Common / Shared
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSchema = exports.gallerySchema = exports.routineSchema = exports.eventSchema = exports.noticeSchema = exports.contactSchema = exports.uuidSchema = exports.paginationSchema = void 0;
exports.paginate = paginate;
const zod_1 = require("zod");
/** Pagination query params — use with req.query */
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
/** Helper to extract take/skip from pagination */
function paginate(query) {
    const parsed = exports.paginationSchema.safeParse(query);
    const page = parsed.success ? parsed.data.page : 1;
    const limit = parsed.success ? parsed.data.limit : 50;
    return { take: limit, skip: (page - 1) * limit };
}
/** UUID validator */
exports.uuidSchema = zod_1.z.string().uuid("Invalid UUID.");
/** Contact form validation */
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required."),
    email: zod_1.z.string().email("Invalid email address."),
    message: zod_1.z.string().min(1, "Message is required."),
});
/** Notice validation */
exports.noticeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required."),
    content: zod_1.z.string().min(1, "Content is required."),
    type: zod_1.z.string().min(1, "Type is required."),
    featuredOnHome: zod_1.z.boolean().optional(),
    floatOnHome: zod_1.z.boolean().optional(),
});
/** Event validation */
exports.eventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required."),
    date: zod_1.z.string().min(1, "Date is required."),
    type: zod_1.z.string().min(1, "Type is required."),
    description: zod_1.z.string().optional().nullable(),
    imageUrl: zod_1.z.string().optional().nullable(),
});
/** Routine entry validation */
exports.routineSchema = zod_1.z.object({
    className: zod_1.z.string().min(1, "Class name is required."),
    section: zod_1.z.string().min(1, "Section is required."),
    dayOfWeek: zod_1.z.string().min(1, "Day of week is required."),
    startTime: zod_1.z.string().min(1, "Start time is required."),
    endTime: zod_1.z.string().min(1, "End time is required."),
    subject: zod_1.z.string().min(1, "Subject is required."),
    teacherName: zod_1.z.string().optional().default(""),
    room: zod_1.z.string().optional().nullable(),
});
/** Gallery item validation */
exports.gallerySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required."),
    imageUrl: zod_1.z.string().optional(),
    description: zod_1.z.string().optional().nullable(),
});
/** Staff profile validation */
exports.staffSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required."),
    role: zod_1.z.string().min(1, "Role is required."),
    bio: zod_1.z.string().optional().nullable(),
    imageUrl: zod_1.z.string().optional().nullable(),
    isHead: zod_1.z.any().optional(),
    sortOrder: zod_1.z.coerce.number().optional().default(0),
});
//# sourceMappingURL=common.js.map