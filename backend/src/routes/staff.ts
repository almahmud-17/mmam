// ================================================================
// Route: /api/staff
// Public leadership/teacher profiles for landing pages
// Admin can create/update/delete
// ================================================================

import { Router, Request, Response } from "express";
import { db } from "../lib/db";
import { authenticate, requireRole } from "../middleware/auth";
import { ROLES } from "../lib/auth";
import { upload } from "../lib/upload";

const router = Router();

// GET /api/staff — Public list (head first, then by sortOrder)
router.get("/", async (_req: Request, res: Response) => {
    try {
        const staff = await db.staffProfile.findMany({
            orderBy: [{ isHead: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        });
        res.json({ success: true, data: staff });
    } catch (err) {
        console.error("[GET STAFF]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch staff profiles." });
    }
});

// GET /api/staff/:id — Single profile
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const staff = await db.staffProfile.findUnique({
            where: { id: String(id) },
        });
        if (!staff) {
            res.status(404).json({ success: false, error: "Profile not found." });
            return;
        }
        res.json({ success: true, data: staff });
    } catch (err) {
        console.error("[GET STAFF DETAIL]:", err);
        res.status(500).json({ success: false, error: "Failed to fetch staff profile." });
    }
});

// POST /api/staff — Admin create with photo upload
router.post("/", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), async (req: Request, res: Response) => {
    try {
        const { name, role, bio, isHead, sortOrder } = req.body;
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        if (!name || !role) {
            res.status(400).json({ success: false, error: "Name and role are required." });
            return;
        }

        const created = await db.staffProfile.create({
            data: {
                name,
                role,
                bio: bio ?? null,
                imageUrl: imageUrl ?? null,
                isHead: String(isHead) === "true",
                sortOrder: !isNaN(Number(sortOrder)) ? Number(sortOrder) : 0,
            },
        });

        res.status(201).json({ success: true, data: created });
    } catch (err) {
        console.error("[POST STAFF]:", err);
        res.status(500).json({ success: false, error: "Failed to create staff profile." });
    }
});

// PUT /api/staff/:id — Admin update with photo upload
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), upload.single("image"), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, role, bio, isHead, sortOrder } = req.body;
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        if (!name || !role) {
            res.status(400).json({ success: false, error: "Name and role are required." });
            return;
        }

        const updated = await db.staffProfile.update({
            where: { id: String(id) },
            data: {
                name,
                role,
                bio: bio ?? null,
                imageUrl: imageUrl ?? null,
                isHead: String(isHead) === "true",
                sortOrder: !isNaN(Number(sortOrder)) ? Number(sortOrder) : 0,
            },
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("[PUT STAFF]:", err);
        res.status(500).json({ success: false, error: "Failed to update staff profile." });
    }
});

// DELETE /api/staff/:id — Admin delete
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.staffProfile.delete({ where: { id: String(id) } });
        res.json({ success: true, message: "Staff profile deleted." });
    } catch (err) {
        console.error("[DELETE STAFF]:", err);
        res.status(500).json({ success: false, error: "Failed to delete staff profile." });
    }
});

export default router;

