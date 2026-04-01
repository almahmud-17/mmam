// ================================================================
// Main Server Entry — SchoolSpace Backend
// Deployed on Render
// ================================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import studentRoutes from "./routes/students";
import teacherRoutes from "./routes/teachers";
import metadataRoutes from "./routes/metadata";
import contactRoutes from "./routes/contacts";
import galleryRoutes from "./routes/gallery";
import noticeRoutes from "./routes/notices";
import staffRoutes from "./routes/staff";
import statsRoutes from "./routes/stats";
import eventsRoutes from "./routes/events";
import routineRoutes from "./routes/routine";
import homeContentRoutes from "./routes/homeContent";
import adminRoutes from "./routes/admin";
import { globalErrorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Headers ──────────────────────────────────────────
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false, // Disable CSP for API server
    })
);

// ─── CORS Configuration ────────────────────────────────────────
/** Vercel prod + preview: FRONTEND_URL="https://app.vercel.app,https://xxx-git-main.vercel.app" */
const corsOrigins =
    process.env.FRONTEND_URL?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

app.use(
    cors({
        origin: corsOrigins.length ? corsOrigins : true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "10mb" }));

// ─── Rate Limiting for Auth Routes ──────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: { success: false, error: "Too many login attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Serve static files from uploads directory with caching
app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"), {
        maxAge: "7d",
        etag: true,
    })
);

// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/metadata", metadataRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/routine", routineRoutes);
app.use("/api/home-content", homeContentRoutes);
app.use("/api/admin", adminRoutes);

// Health Check
app.get("/", (req: express.Request, res: express.Response) => {
    res.json({ message: "SchoolSpace API is running.", status: "ok" });
});

// ─── Global Error Handler (MUST be last) ────────────────────────
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`[SERVER]: Running on port ${PORT}`);
});
