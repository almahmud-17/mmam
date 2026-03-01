// ================================================================
// Route: /api/contacts
// Manages public contact messages
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";

const router = Router();

// POST /api/contacts — Public submission
router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ success: false, error: "All fields are required." });
            return;
        }

        const newContact = await db.contactRequest.create({
            data: {
                name: String(name).trim(),
                email: String(email).toLowerCase().trim(),
                message: String(message).trim(),
            }
        });

        res.status(201).json({ success: true, data: newContact });
    } catch (err) {
        console.error("[POST CONTACT]:", err);
        res.status(500).json({ success: false, error: "Failed to send message." });
    }
});

// GET /api/contacts — Admin list
router.get("/", authenticate, requireRole(ROLES.ADMIN), async (_req: Request, res: Response) => {
    try {
        const contacts = await db.contactRequest.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.json({ success: true, data: contacts });
    } catch (err) {
        console.error("[GET CONTACTS]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch messages." });
    }
});

// PATCH /api/contacts/:id — Toggle read status
router.patch("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isRead } = req.body;

        const updated = await db.contactRequest.update({
            where: { id: String(id) },
            data: { isRead: Boolean(isRead) }
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("[PATCH CONTACT]:", err);
        res.status(500).json({ success: false, error: "Failed to update status." });
    }
});

// DELETE /api/contacts/:id — Delete request
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.contactRequest.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Message deleted." });
    } catch (err) {
        console.error("[DELETE CONTACT]:", err);
        res.status(500).json({ success: false, error: "Failed to delete message." });
    }
});

export default router;
