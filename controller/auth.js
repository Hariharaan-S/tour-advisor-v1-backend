import express from "express";
import { registerUser, loginUser, refreshToken as refreshTokenService, logoutUser } from "../services/auth.service.js";


const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const registerResponse = await registerUser(username, email, password);
        const { accessToken, refreshToken, ...userPayload } = registerResponse;
        
        res.status(201).header("Authorization", `Bearer ${accessToken}`).json({
            message: "User registered successfully",
            accessToken,
            refreshToken,
            user: userPayload,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const loginResponse = await loginUser(email, password);
        const { accessToken, refreshToken, ...userPayload } = loginResponse;
        res.status(200).json({ message: "Login successful", accessToken, refreshToken, user: userPayload });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});


router.post("/refresh/token", async (req, res) => {
    const { token } = req.body;
    console.log(token);
    
    if (!token) {
        return res.status(401).json({ message: "Refresh token not recognized" });
    }

    try {
        const { accessToken, refreshToken: newRefreshToken } = await refreshTokenService(token);

        res.status(200).json({
            message: "Token refreshed",
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
});


// logout endpoint - invalidate a refresh token
router.post("/logout", async (req, res) => {
    const { token } = req.body;
    if (token) {
        try {
            const loggedOut = await logoutUser(token);
            if (!loggedOut) {
                return res.status(400).json({ message: "Invalid token" });
            }
        } catch (err) {
            // invalid token; nothing to delete
        }
    }
    res.status(204).end();
});


export default router;