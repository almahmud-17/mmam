"use strict";
// ================================================================
// Zod Validation Schemas — Teacher
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeacherSchema = exports.createTeacherSchema = void 0;
const zod_1 = require("zod");
exports.createTeacherSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters."),
    email: zod_1.z.string().email("Invalid email address."),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters."),
    phone: zod_1.z.string().optional().nullable(),
    specialization: zod_1.z.string().optional().nullable(),
    bio: zod_1.z.string().optional().nullable(),
    qualifications: zod_1.z.string().optional().nullable(),
    experience: zod_1.z.string().optional().nullable(),
});
exports.updateTeacherSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters.").optional(),
    email: zod_1.z.string().email("Invalid email address.").optional(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters.").optional(),
    phone: zod_1.z.string().optional().nullable(),
    specialization: zod_1.z.string().optional().nullable(),
    bio: zod_1.z.string().optional().nullable(),
    qualifications: zod_1.z.string().optional().nullable(),
    experience: zod_1.z.string().optional().nullable(),
});
//# sourceMappingURL=teacher.js.map