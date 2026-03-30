"use strict";
// ================================================================
// Route: /api/metadata
// Fetches common school metadata like classes, sections, etc.
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/metadata/classes
router.get("/classes", auth_1.authenticate, async (_req, res) => {
    try {
        const classes = await db_1.db.class.findMany({
            include: { sections: true }
        });
        res.json({ success: true, data: classes });
    }
    catch (err) {
        console.error("[GET CLASSES]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch classes." });
    }
});
// GET /api/metadata/sections
router.get("/sections", auth_1.authenticate, async (_req, res) => {
    try {
        const sections = await db_1.db.section.findMany({
            include: { class: true }
        });
        res.json({ success: true, data: sections });
    }
    catch (err) {
        console.error("[GET SECTIONS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch sections." });
    }
});
exports.default = router;
//# sourceMappingURL=metadata.js.map