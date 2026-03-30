// ================================================================
// Main Server Entry — SchoolSpace Backend
// Deployed on Render
// ================================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/** Vercel prod + preview: FRONTEND_URL="https://app.vercel.app,https://xxx-git-main.vercel.app" */
const corsOrigins =
    process.env.FRONTEND_URL?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

// Middleware — `origin: true` reflects request Origin (ok for local dev); prod এ FRONTEND_URL সেট করুন
app.use(
    cors({
        origin: corsOrigins.length ? corsOrigins : true,
        credentials: true,
    })
);
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
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

// Health Check
app.get("/", (req: express.Request, res: express.Response) => {
    res.json({ message: "SchoolSpace API is running.", status: "ok" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[SERVER]: Running on port ${PORT}`);
});
