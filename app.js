import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRouter from "./controller/auth.js";
import placesRouter from "./controller/places.js";
import planRouter from "./controller/plans.js";
import { mongooseClient, redisClient } from "./utils/db.utils.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// DB Connection
mongooseClient.then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error.message));

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/places", placesRouter);
app.use("/api/plan", planRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
