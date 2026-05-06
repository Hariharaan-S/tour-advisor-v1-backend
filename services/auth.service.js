import bcrypt from "bcrypt";
import { randomUUID, createHash } from "crypto";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repository/user.repository.js";
import { redisClient } from "../utils/db.utils.js";

/**
 * Deterministic Redis-safe hash
 */
const hashUserId = (id) => {
  return createHash("sha256").update(String(id)).digest("hex");
};

/**
 * JWT Creation
 */
const createTokens = (payload) => {
    console.log("Creating tokens with payload:", payload);
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
});

const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

/**
 * Redis key generator
 */
const getRedisKey = (userId) => {
  return `refresh:${hashUserId(userId)}`;
};

/**
 * Register User
 */
export const registerUser = async (username, email, password) => {
  try {
    const existing = await findUserByEmail(email);

    if (existing) {
      throw new Error("Email already in use");
    }

    /**
     * Password hashing
     */
    const passwordHash = await bcrypt.hash(password, 10);

    /**
     * UUID generation
     */
    const id = randomUUID();

    const userData = {
      id,
      username,
      email,
      passwordHash,
    };

    const user = await createUser(userData);

    /**
     * Create JWTs
     */
    const { accessToken, refreshToken } = createTokens({
      id,
      email,
    });

    /**
     * Store refresh token in Redis
     */
    const redisKey = getRedisKey(id);

    console.log("Register Redis Key:", redisKey);

    await redisClient.set(redisKey, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/**
 * Login User
 */
export const loginUser = async (email, password) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    /**
     * Verify password
     */
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    /**
     * Create tokens
     */
    const { accessToken, refreshToken } = createTokens({
      id: user.id,
      email: user.email,
    });

    /**
     * Redis storage
     */
    const redisKey = getRedisKey(user.id);

    console.log("Login Redis Key:", redisKey);

    await redisClient.set(redisKey, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

/**
 * Logout User
 */
export const logoutUser = async (userId) => {
  try {
    const redisKey = getRedisKey(userId);

    console.log("Deleting Redis Key:", redisKey);

    await redisClient.del(redisKey);
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

/**
 * Refresh Token
 */
export const refreshToken = async (token) => {
  console.log("Attempting token refresh");

  try {
    /**
     * Verify JWT
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);

    /**
     * Redis lookup
     */
    const redisKey = getRedisKey(decoded.id);

    console.log("Looking up Redis Key:", redisKey);

    const storedToken = await redisClient.get(redisKey);

    console.log("Stored Refresh Token:", storedToken);

    /**
     * Validate refresh token
     */
    if (!storedToken || storedToken !== token) {
      throw new Error("Refresh token not recognized");
    }

    /**
     * Generate new tokens
     */
    const tokens = createTokens({
      id: decoded.id,
      email: decoded.email,
    });

    /**
     * Rotate refresh token
     */
    await redisClient.set(redisKey, tokens.refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    console.log("Tokens refreshed successfully");

    return tokens;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

/**
 * Update User Trip Plans
 */
export const findByIdAndUpdateTripPlan = async (id, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          tripPlans: updateData,
        },
      },
      {
        new: true,
      },
    );

    return updatedUser;
  } catch (error) {
    console.error("Error updating user's trip plans:", error);
    throw error;
  }
};
