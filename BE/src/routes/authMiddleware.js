const jwt = require("jsonwebtoken");
const JWT_SECRET = "DRDE";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: Missing or invalid token",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized: Token verification failed" });
  }
};

module.exports = { authMiddleware };
