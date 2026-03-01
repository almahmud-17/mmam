// ================================================================
// Main Server Entry — SchoolSpace Backend
// Deployed on Render
// ================================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import studentRoutes from "./routes/students";
import teacherRoutes from "./routes/teachers";
import metadataRoutes from "./routes/metadata";
import contactRoutes from "./routes/contacts";
import galleryRoutes from "./routes/gallery";
import noticeRoutes from "./routes/notices";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "*", // In prod, set this to your Vercel URL
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/metadata", metadataRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/notices", noticeRoutes);

// Health Check
app.get("/", (req: express.Request, res: express.Response) => {
    res.json({ message: "SchoolSpace API is running.", status: "ok" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[SERVER]: Running on port ${PORT}`);
});
