// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  // 1. Get the Authorization header (Bearer token)
  const authHeader = req.headers.authorization;

  // 2. Check if it exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  // exauthHeader = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzQ5NjI5MjgyLCJleHAiOjE3NDk2MzI4ODJ9.oI_ITNJcyWE5yGt77J4Z-9QCM8tlN5Zs8mL2b8lzVbo

  // 3. Extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify token using the secret
    const decoded = jwt.verify(token, process.env.SECRET);

    // 5. Attach decoded user to request
    req.user = decoded; // typically { id: userId, iat, exp }

    // 6. Allow route to continue
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Invalid or expired token",
    });
  }
};
