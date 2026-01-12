import express from "express";

const planRouter = express.Router();

planRouter.get("/view-plan/:planId", (req, res) => {
  res.json({ message: "Sample Output from Plans Router" });
});

planRouter.post("/make-plan", async (req, res) => {
  try {
    const { cityName, numberOfDays, budget } = req.body;
    const PROMPT_TEMPLATE = `Create a detailed travel plan for a trip to ${cityName} lasting ${numberOfDays} 
        days with a budget of ${budget} INR. The places to visit should be in top tourist locations.`;
    const response = await fetch("http://127.0.0.1:8000/plan-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: cityName,
        question: PROMPT_TEMPLATE,
      }),
    });

    const data = await response.json();

    res.json({ plan: data });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

export default planRouter;
