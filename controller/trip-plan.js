import express from "express";
import { makeNewTripPlan,getUserTrackedPlans, getTripPlanById } from "../services/trip-plan.service.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const planRouter = express.Router();

planRouter.get("/view-all/:userId", authenticateToken,  async(req,res) => {
  const userId = req.params.userId;
  if(!userId) {
    return res.status(401).json({ message: "User identity not found in request" });
  }

  const userPlans = await getUserTrackedPlans(userId);
  if (!userPlans) {
    return res.status(404).json({ message: "No trip plans found for user" });
  }

  
  let userPlansArray = new Array(userPlans.length);
  for (const userPlan of userPlans[0].planId) {
    userPlansArray.push(await getTripPlanById(userPlan))
  }

  res.status(200).json({ message: "Trip plans retrieved successfully", userPlansArray });

})

planRouter.get("/view-plan/:userId/:planId", authenticateToken, async(req, res) => {

  const {userId, planId} = req.params;
  if (!userId) {
    return res.status(401).json({ message: "User identity not found in token" });
  }

  const userPlans = await getUserTrackedPlans(userId);
  if (!userPlans) {
    return res.status(404).json({ message: "No trip plans found for user" });
  }
  
  let targetPlanId;
  for (const userPlan of userPlans) {
    if (userPlan.planId.includes(planId)) {
      targetPlanId = planId;
      break;
    }
  }
  if (!targetPlanId) {
    return res.status(404).json({ message: "Target trip plan not found" });
  }
  const planData = await getTripPlanById(targetPlanId);
  if (!planData) {
    return res.status(404).json({ message: "Trip plan data not found" });
  }
  
  res.status(200).json({ message: "Trip plan retrieved successfully", planData });
});

planRouter.post("/make-plan", authenticateToken, async (req, res) => {
  try {
    const { cityName, numberOfDays, budget, coordinates, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User identity not found in token" });
    }

    const tripPlan = await makeNewTripPlan(cityName, numberOfDays, budget, userId, coordinates);

    //TODO: From tripPlan, for each plan, extract the title,description and total_cost_for_people and send it back in the response for frontend to show in the card view.

    const responsePayload = {
      message: "Trip plan created successfully",
      tripPlan: tripPlan.map((plan) => ({
        planId: plan.planId,
        title: plan.title,
        description: plan.description,
        total_cost_for_people: plan.cost_summary?.total_cost_for_people,
        people: plan.people,
      })),
    };

    const newAccessToken = res.getHeader("x-access-token");
    if (newAccessToken) {
      responsePayload.accessToken = newAccessToken;
    }

    res.status(201).json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

export default planRouter;
