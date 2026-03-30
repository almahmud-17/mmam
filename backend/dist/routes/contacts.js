"use strict";
// ================================================================
// Route: /api/contacts
// Manages public contact messages
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const router = (0, express_1.Router)();
// POST /api/contacts — Public submission
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ success: false, error: "All fields are required." });
            return;
        }
        const newContact = await db_1.db.contactRequest.create({
            data: {
                name: String(name).trim(),
                email: String(email).toLowerCase().trim(),
                message: String(message).trim(),
            }
        });
        res.status(201).json({ success: true, data: newContact });
    }
    catch (err) {
        console.error("[POST CONTACT]:", err);
        res.status(500).json({ success: false, error: "Failed to send message." });
    }
});
// GET /api/contacts — Admin list
router.get("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (_req, res) => {
    try {
        const contacts = await db_1.db.contactRequest.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.json({ success: true, data: contacts });
    }
    catch (err) {
        console.error("[GET CONTACTS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch messages." });
    }
});
// PATCH /api/contacts/:id — Toggle read status
router.patch("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { id } = req.params;
        const { isRead } = req.body;
        const updated = await db_1.db.contactRequest.update({
            where: { id: String(id) },
            data: { isRead: Boolean(isRead) }
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error("[PATCH CONTACT]:", err);
        res.status(500).json({ success: false, error: "Failed to update status." });
    }
});
// DELETE /api/contacts/:id — Delete request
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.db.contactRequest.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Message deleted." });
    }
    catch (err) {
        console.error("[DELETE CONTACT]:", err);
        res.status(500).json({ success: false, error: "Failed to delete message." });
    }
});
exports.default = router;
//# sourceMappingURL=contacts.js.map