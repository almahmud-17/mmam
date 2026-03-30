"use strict";
// ================================================================
// Auth Middleware — JWT token verification
// ================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const auth_1 = require("../lib/auth");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "Unauthorized: no token provided." });
        return;
    }
    const token = authHeader.split(" ")[1];
    const payload = (0, auth_1.verifyToken)(token);
    if (!payload) {
        res.status(401).json({ success: false, error: "Unauthorized: invalid or expired token." });
        return;
    }
    req.user = payload;
    next();
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Unauthorized." });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, error: "Forbidden: insufficient permissions." });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map