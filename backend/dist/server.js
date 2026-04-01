"use strict";
// ================================================================
// Main Server Entry — SchoolSpace Backend
// Deployed on Render
// ================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const students_1 = __importDefault(require("./routes/students"));
const teachers_1 = __importDefault(require("./routes/teachers"));
const metadata_1 = __importDefault(require("./routes/metadata"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const notices_1 = __importDefault(require("./routes/notices"));
const staff_1 = __importDefault(require("./routes/staff"));
const stats_1 = __importDefault(require("./routes/stats"));
const events_1 = __importDefault(require("./routes/events"));
const routine_1 = __importDefault(require("./routes/routine"));
const homeContent_1 = __importDefault(require("./routes/homeContent"));
const admin_1 = __importDefault(require("./routes/admin"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ─── Security Headers ──────────────────────────────────────────
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable CSP for API server
}));
// ─── CORS Configuration ────────────────────────────────────────
/** Vercel prod + preview: FRONTEND_URL="https://app.vercel.app,https://xxx-git-main.vercel.app" */
const corsOrigins = process.env.FRONTEND_URL?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
app.use((0, cors_1.default)({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json({ limit: "10mb" }));
// ─── Rate Limiting for Auth Routes ──────────────────────────────
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: { success: false, error: "Too many login attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
// Serve static files from uploads directory with caching
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads"), {
    maxAge: "7d",
    etag: true,
}));
// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, auth_1.default);
app.use("/api/students", students_1.default);
app.use("/api/teachers", teachers_1.default);
app.use("/api/metadata", metadata_1.default);
app.use("/api/contacts", contacts_1.default);
app.use("/api/gallery", gallery_1.default);
app.use("/api/notices", notices_1.default);
app.use("/api/staff", staff_1.default);
app.use("/api/stats", stats_1.default);
app.use("/api/events", events_1.default);
app.use("/api/routine", routine_1.default);
app.use("/api/home-content", homeContent_1.default);
app.use("/api/admin", admin_1.default);
// Health Check
app.get("/", (req, res) => {
    res.json({ message: "SchoolSpace API is running.", status: "ok" });
});
// ─── Global Error Handler (MUST be last) ────────────────────────
app.use(errorHandler_1.globalErrorHandler);
// Start Server
app.listen(PORT, () => {
    console.log(`[SERVER]: Running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map