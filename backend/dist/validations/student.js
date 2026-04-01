"use strict";
// ================================================================
// Zod Validation Schemas — Student
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentSchema = exports.createStudentSchema = void 0;
const zod_1 = require("zod");
exports.createStudentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters."),
    email: zod_1.z.string().email("Invalid email address."),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters."),
    phone: zod_1.z.string().optional().nullable(),
    rollNo: zod_1.z.coerce.number().int().positive("Roll number must be positive."),
    sectionId: zod_1.z.string().uuid("Invalid section ID."),
});
exports.updateStudentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters.").optional(),
    email: zod_1.z.string().email("Invalid email address.").optional(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters.").optional(),
    phone: zod_1.z.string().optional().nullable(),
    rollNo: zod_1.z.coerce.number().int().positive("Roll number must be positive.").optional(),
    sectionId: zod_1.z.string().uuid("Invalid section ID.").optional(),
});
//# sourceMappingURL=student.js.map