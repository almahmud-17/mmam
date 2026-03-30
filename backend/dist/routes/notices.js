"use strict";
// ================================================================
// Route: /api/notices
// Manages school notices and announcements
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const router = (0, express_1.Router)();
// GET /api/notices — Public list
router.get("/", async (_req, res) => {
    try {
        const notices = await db_1.db.notice.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.json({ success: true, data: notices });
    }
    catch (err) {
        console.error("[GET NOTICES]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch notices." });
    }
});
// POST /api/notices — Admin add notice
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { title, content, type } = req.body;
        if (!title || !content || !type) {
            res.status(400).json({ success: false, error: "Title, content, and type are required." });
            return;
        }
        const newNotice = await db_1.db.notice.create({
            data: { title, content, type }
        });
        res.status(201).json({ success: true, data: newNotice });
    }
    catch (err) {
        console.error("[POST NOTICE]:", err);
        res.status(500).json({ success: false, error: "Failed to create notice." });
    }
});
// PUT /api/notices/:id — Admin update notice
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type } = req.body;
        if (!title || !content || !type) {
            res.status(400).json({ success: false, error: "Title, content, and type are required." });
            return;
        }
        const updated = await db_1.db.notice.update({
            where: { id: String(id) },
            data: { title, content, type },
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error("[PUT NOTICE]:", err);
        res.status(500).json({ success: false, error: "Failed to update notice." });
    }
});
// DELETE /api/notices/:id — Admin remove notice
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.db.notice.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Notice deleted." });
    }
    catch (err) {
        console.error("[DELETE NOTICE]:", err);
        res.status(500).json({ success: false, error: "Failed to delete notice." });
    }
});
exports.default = router;
//# sourceMappingURL=notices.js.map