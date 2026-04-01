// ================================================================
// Route: /api/contacts
// Manages public contact messages
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";
import { contactSchema, paginate } from "../validations/common";

const router = Router();

// POST /api/contacts — Public submission
router.post("/", asyncHandler(async (req: Request, res: Response) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { name, email, message } = parsed.data;

    const newContact = await db.contactRequest.create({
        data: {
            name: String(name).trim(),
            email: String(email).toLowerCase().trim(),
            message: String(message).trim(),
        }
    });

    invalidateCache("/api/contacts");
    res.status(201).json({ success: true, data: newContact });
}));

// GET /api/contacts — Admin list (paginated)
router.get("/", authenticate, requireRole(ROLES.ADMIN), cacheMiddleware(60), asyncHandler(async (req: Request, res: Response) => {
    const { take, skip } = paginate(req.query);

    const [contacts, total] = await Promise.all([
        db.contactRequest.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        db.contactRequest.count(),
    ]);

    res.json({ success: true, data: contacts, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// PATCH /api/contacts/:id — Toggle read status
router.patch("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isRead } = req.body;

    const updated = await db.contactRequest.update({
        where: { id: String(id) },
        data: { isRead: Boolean(isRead) }
    });

    invalidateCache("/api/contacts");
    res.json({ success: true, data: updated });
}));

// DELETE /api/contacts/:id — Delete request
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.contactRequest.delete({ where: { id: String(id) } });
    invalidateCache("/api/contacts");
    res.json({ success: true, message: "Message deleted." });
}));

export default router;
