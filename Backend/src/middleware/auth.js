// Backend/src/middleware/auth.js
const jwt = require("jsonwebtoken");

function authRequired(roles = []) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "No token" });

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "dev_secret_change_me"
      );
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = payload; // { id, email, role }
      next();
    } catch {
      return res.status(401).json({ message: "Invalied token" });
    }
  };
}

module.exports = { authRequired };
