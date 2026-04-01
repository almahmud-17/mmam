import { z } from "zod";
export declare const createTeacherSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    specialization: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    qualifications: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    experience: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateTeacherSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    specialization: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    qualifications: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    experience: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=teacher.d.ts.map