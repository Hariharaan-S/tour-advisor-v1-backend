import UserPlans from "../model/userPlans.model.js";


export const trackTripPlan = async (userId, planId) => {
    try {
        // planId is stored as an array of strings in the schema.
        // Ensure we always update the user's document and append new plan IDs.
        const planIds = Array.isArray(planId) ? planId : [planId];

        const userPlan = await UserPlans.findOneAndUpdate(
            { userId },
            { $addToSet: { planId: { $each: planIds } } },
            { upsert: true, new: true }
        );

        return userPlan;
    } catch (error) {
        console.error("Error tracking trip plan:", error);
        throw error;
    }
};

export const getTrackedPlansByUserId = async (userId) => {
    try {
        return await UserPlans.find({ userId });
    } catch (error) {
        console.error("Error fetching tracked plans for user:", error);
        throw error;
    }
};