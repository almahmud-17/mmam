// ================================================================
// Route: /api/staff
// Public leadership/teacher profiles for landing pages
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { upload } from "../lib/upload";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { asyncHandler } from "../middleware/errorHandler";
import { staffSchema, paginate } from "../validations/common";

const router = Router();

// GET /api/staff — Public list (head first, then by sortOrder, paginated)
router.get("/", cacheMiddleware(300), asyncHandler(async (req: Request, res: Response) => {
    const { take, skip } = paginate(req.query);

    const [staff, total] = await Promise.all([
        db.staffProfile.findMany({
            orderBy: [{ isHead: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
            take,
            skip,
        }),
        db.staffProfile.count(),
    ]);

    res.json({ success: true, data: staff, pagination: { total, page: Math.floor(skip / take) + 1, limit: take } });
}));

// GET /api/staff/:id — Single profile
router.get("/:id", cacheMiddleware(300), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const staff = await db.staffProfile.findUnique({ where: { id: String(id) } });
    if (!staff) {
        res.status(404).json({ success: false, error: "Profile not found." });
        return;
    }
    res.json({ success: true, data: staff });
}));

// POST /api/staff — Admin create with photo upload
router.post("/", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), asyncHandler(async (req: Request, res: Response) => {
    const parsed = staffSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { name, role, bio, sortOrder } = parsed.data;
    let imageUrl = req.body.imageUrl;
    const isHead = String(req.body.isHead) === "true";

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    const created = await db.staffProfile.create({
        data: {
            name, role,
            bio: bio ?? null,
            imageUrl: imageUrl ?? null,
            isHead,
            sortOrder: !isNaN(Number(sortOrder)) ? Number(sortOrder) : 0,
        },
    });

    invalidateCache("/api/staff");
    res.status(201).json({ success: true, data: created });
}));

// PUT /api/staff/:id — Admin update with photo upload
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsed = staffSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({ success: false, error: messages });
        return;
    }

    const { name, role, bio, sortOrder } = parsed.data;
    let imageUrl = req.body.imageUrl;
    const isHead = String(req.body.isHead) === "true";

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await db.staffProfile.update({
        where: { id: String(id) },
        data: {
            name, role,
            bio: bio ?? null,
            imageUrl: imageUrl ?? null,
            isHead,
            sortOrder: !isNaN(Number(sortOrder)) ? Number(sortOrder) : 0,
        },
    });

    invalidateCache("/api/staff");
    res.json({ success: true, data: updated });
}));

// DELETE /api/staff/:id — Admin delete
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.staffProfile.delete({ where: { id: String(id) } });
    invalidateCache("/api/staff");
    res.json({ success: true, message: "Staff profile deleted." });
}));

export default router;
