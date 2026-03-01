// ================================================================
// Prisma Client Singleton — SchoolSpace Backend
// ================================================================

import { PrismaClient } from "@prisma/client";

declare global {
    var __prisma: PrismaClient | undefined;
}

export const db =
    globalThis.__prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma = db;
}
