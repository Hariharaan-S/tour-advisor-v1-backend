import express from "express";
import { makeNewTripPlan } from "../services/trip-plan.service.js";

const planRouter = express.Router();

planRouter.get("/view-plan/:planId", (req, res) => {
  res.json({ message: "Sample Output from Plans Router" });
});

planRouter.post("/make-plan", async (req, res) => {
  try {
    const { cityName, numberOfDays, budget, userId } = req.body;
    const tripPlan = await makeNewTripPlan(cityName, numberOfDays, budget, userId);
    res.status(201).json({ message: "Trip plan created successfully", tripPlan });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

export default planRouter;
