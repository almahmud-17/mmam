"use strict";
// ================================================================
// Prisma Client Singleton — SchoolSpace Backend
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
exports.db = globalThis.__prisma ??
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
    });
if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma = exports.db;
}
//# sourceMappingURL=db.js.map