"use strict";
// ================================================================
// Route: /api/metadata
// Fetches common school metadata like classes, sections, etc.
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/metadata/classes
router.get("/classes", auth_1.authenticate, (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const classes = await db_1.db.class.findMany({
        select: {
            id: true, name: true,
            sections: { select: { id: true, name: true } },
        },
    });
    res.json({ success: true, data: classes });
}));
// GET /api/metadata/sections
router.get("/sections", auth_1.authenticate, (0, cache_1.cacheMiddleware)(300), (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const sections = await db_1.db.section.findMany({
        select: {
            id: true, name: true,
            class: { select: { id: true, name: true } },
        },
    });
    res.json({ success: true, data: sections });
}));
exports.default = router;
//# sourceMappingURL=metadata.js.map