import express from "express";
import dotenv from "dotenv";
import placesRouter from "./routes/places.js";
import planRouter from "./routes/plans.js";

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/api/places", placesRouter);
app.use("/api/plan", planRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
