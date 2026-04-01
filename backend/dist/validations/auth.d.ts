import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=auth.d.ts.map