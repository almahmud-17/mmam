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
const cache_1 = require("../middleware/cache");
const errorHandler_1 = require("../middleware/errorHandler");
const common_1 = require("../validations/common");
const router = (0, express_1.Router)();
// POST /api/contacts — Public submission
router.post("/", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = common_1.contactSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }
    const { name, email, message } = parsed.data;
    const newContact = await db_1.db.contactRequest.create({
        data: {
            name: String(name).trim(),
            email: String(email).toLowerCase().trim(),
            message: String(message).trim(),
        }
    });
    (0, cache_1.invalidateCache)("/api/contacts");
    res.status(201).json({ success: true, data: newContact });
}));
// GET /api/contacts — Admin list (paginated)
router.get("/", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, cache_1.cacheMiddleware)(60), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { take, skip } = (0, common_1.paginate)(req.query);
    const [contacts, total] = await Promise.all([
        db_1.db.contactRequest.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        db_1.db.contactRequest.count(),
    ]);
    res.json({ success: true, data: contacts, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));
// PATCH /api/contacts/:id — Toggle read status
router.patch("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { isRead } = req.body;
    const updated = await db_1.db.contactRequest.update({
        where: { id: String(id) },
        data: { isRead: Boolean(isRead) }
    });
    (0, cache_1.invalidateCache)("/api/contacts");
    res.json({ success: true, data: updated });
}));
// DELETE /api/contacts/:id — Delete request
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(auth_2.ROLES.ADMIN), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await db_1.db.contactRequest.delete({ where: { id: String(id) } });
    (0, cache_1.invalidateCache)("/api/contacts");
    res.json({ success: true, message: "Message deleted." });
}));
exports.default = router;
//# sourceMappingURL=contacts.js.map