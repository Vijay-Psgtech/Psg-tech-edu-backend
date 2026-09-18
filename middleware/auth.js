const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? null : "psgtech-development-secret");

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireDepartmentEditor(req, res, next) {
  requireAdmin(req, res, () => {
    const slug = String(req.params.slug || "").toLowerCase();
    if (!req.admin.departmentSlugs?.includes(slug)) {
      return res.status(403).json({ message: "You are not permitted to edit this department" });
    }
    next();
  });
}

module.exports = { requireAdmin, requireDepartmentEditor };
