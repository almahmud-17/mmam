export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
export declare function validatePassword(password: string): {
    valid: boolean;
    error?: string;
};
export interface JwtPayload {
    userId: string;
    role: string;
}
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload | null;
export declare const ROLES: {
    readonly ADMIN: "ADMIN";
    readonly TEACHER: "TEACHER";
    readonly STUDENT: "STUDENT";
};
export declare const ATTENDANCE_STATUS: {
    readonly PRESENT: "PRESENT";
    readonly ABSENT: "ABSENT";
    readonly LATE: "LATE";
};
export declare const NOTICE_TYPE: {
    readonly GENERAL: "GENERAL";
    readonly ACADEMIC: "ACADEMIC";
    readonly EMERGENCY: "EMERGENCY";
};
export declare const EXAM_TYPE: {
    readonly CLASS_TEST: "CLASS_TEST";
    readonly MID: "MID";
    readonly FINAL: "FINAL";
};
//# sourceMappingURL=auth.d.ts.map