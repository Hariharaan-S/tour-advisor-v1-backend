import jwt from "jsonwebtoken";
import { redisClient } from "../utils/db.utils.js";
import { hashId } from "../utils/auth-middleware.utils.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["Authorization"] || req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name !== "TokenExpiredError") {
      return res.status(403).json({ message: "Invalid access token" });
    }
  }

  // Access token expired
  const refreshToken = req.headers["x-refresh-token"] || req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Access token expired. Provide refresh token or login again" });
  }

  let decodedRefresh;
  try {
    decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token. Please login again" });
  }

  try {
    const hashedUserId = hashId(decodedRefresh.id);
    const storedToken = await redisClient.get(hashedUserId);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh token not recognized, please login" });
    }

    const newAccessToken = jwt.sign(
      { id: decodedRefresh.id, email: decodedRefresh.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // send back new access token for client to store
    res.setHeader("x-access-token", newAccessToken);
    req.user = decodedRefresh;
    return next();
  } catch (err) {
    console.error("Error validating refresh token:", err);
    return res.status(500).json({ message: "Token auth error" });
  }
};
