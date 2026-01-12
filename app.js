import express from "express";
import dotenv from "dotenv";
import placesRouter from "./controller/places.js";
import planRouter from "./controller/plans.js";
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/places", placesRouter);
app.use("/api/plan", planRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
