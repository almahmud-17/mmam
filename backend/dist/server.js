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
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "*", // In prod, set this to your Vercel URL
    credentials: true
}));
app.use(express_1.default.json());
// Serve static files from uploads directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Routes
app.use("/api/auth", auth_1.default);
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
// Health Check
app.get("/", (req, res) => {
    res.json({ message: "SchoolSpace API is running.", status: "ok" });
});
// Start Server
app.listen(PORT, () => {
    console.log(`[SERVER]: Running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map