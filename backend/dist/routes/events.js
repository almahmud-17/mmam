"use strict";
// ================================================================
// Route: /api/events
// School events / calendar items
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const router = (0, express_1.Router)();
// GET /api/events — public upcoming events
router.get("/", async (_req, res) => {
    try {
        const events = await db_1.db.event.findMany({
            orderBy: { date: "asc" },
        });
        res.json({ success: true, data: events });
    }
    catch (err) {
        console.error("[GET EVENTS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch events." });
    }
});
// POST /api/events — admin create
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { title, date, type, description, imageUrl } = req.body;
        if (!title || !date || !type) {
            res.status(400).json({ success: false, error: "Title, date and type are required." });
            return;
        }
        const created = await db_1.db.event.create({
            data: {
                title,
                date: new Date(date),
                type,
                description: description ?? null,
                imageUrl: imageUrl ?? null,
            },
        });
        res.status(201).json({ success: true, data: created });
    }
    catch (err) {
        console.error("[POST EVENT]:", err);
        res.status(500).json({ success: false, error: "Failed to create event." });
    }
});
// PUT /api/events/:id — admin update
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, type, description, imageUrl } = req.body;
        if (!title || !date || !type) {
            res.status(400).json({ success: false, error: "Title, date and type are required." });
            return;
        }
        const updated = await db_1.db.event.update({
            where: { id: String(id) },
            data: {
                title,
                date: new Date(date),
                type,
                description: description ?? null,
                imageUrl: imageUrl ?? null,
            },
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error("[PUT EVENT]:", err);
        res.status(500).json({ success: false, error: "Failed to update event." });
    }
});
// DELETE /api/events/:id — admin delete
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.db.event.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Event deleted." });
    }
    catch (err) {
        console.error("[DELETE EVENT]:", err);
        res.status(500).json({ success: false, error: "Failed to delete event." });
    }
});
exports.default = router;
//# sourceMappingURL=events.js.map