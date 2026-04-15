const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = header.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // ✅ no console.log anymore
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;