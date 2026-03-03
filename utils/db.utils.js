import mongoose from "mongoose";
import { createClient } from "redis";

const dbURI = 'mongodb://localhost/tour_advisor';

// Connect to MongoDB
export const mongooseClient = mongoose.connect(dbURI)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

export const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));
// connect eagerly; top‑level await is allowed since we are using ES modules
await redisClient.connect();
