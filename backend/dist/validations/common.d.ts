import { z } from "zod";
/** Pagination query params — use with req.query */
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type PaginationParams = z.infer<typeof paginationSchema>;
/** Helper to extract take/skip from pagination */
export declare function paginate(query: Record<string, any>): {
    take: number;
    skip: number;
};
/** UUID validator */
export declare const uuidSchema: z.ZodString;
/** Contact form validation */
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
/** Notice validation */
export declare const noticeSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    type: z.ZodString;
    featuredOnHome: z.ZodOptional<z.ZodBoolean>;
    floatOnHome: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/** Event validation */
export declare const eventSchema: z.ZodObject<{
    title: z.ZodString;
    date: z.ZodString;
    type: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
/** Routine entry validation */
export declare const routineSchema: z.ZodObject<{
    className: z.ZodString;
    section: z.ZodString;
    dayOfWeek: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    subject: z.ZodString;
    teacherName: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    room: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
/** Gallery item validation */
export declare const gallerySchema: z.ZodObject<{
    title: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
/** Staff profile validation */
export declare const staffSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodString;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isHead: z.ZodOptional<z.ZodAny>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
//# sourceMappingURL=common.d.ts.map