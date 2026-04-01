import { z } from "zod";
export declare const createStudentSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    rollNo: z.ZodCoercedNumber<unknown>;
    sectionId: z.ZodString;
}, z.core.$strip>;
export declare const updateStudentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    rollNo: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    sectionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=student.d.ts.map