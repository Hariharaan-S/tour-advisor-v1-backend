import 'dotenv/config'
import mongoose from "mongoose";
import { createClient } from "redis";


// Connect to MongoDB
export const mongooseClient = mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

export const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://redis:6379",
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));
// connect eagerly; top‑level await is allowed since we are using ES modules
await redisClient.connect();
