import TripPlan from "../model/trip-plan.model.js";

export const createTripPlan = async (tripPlanData) => {
    try {
        const tripPlan = new TripPlan(tripPlanData);
        await tripPlan.save();
        return tripPlan;
    } catch (error) {
        console.error("Error creating trip plan:", error);
        throw error;
    }
};

export const getAllTripPlans = async () => {
    try {
        return await TripPlan.find();
    } catch (error) {
        console.error("Error fetching trip plans:", error);
        throw error;
    }
};

export const getPlanById = async (id) => {
    try {
        return await TripPlan.findById(id);
    } catch (error) {
        console.error("Error fetching trip plan by ID:", error);
        throw error;
    }
};

export const updateTripPlan = async (id, updateData) => {
    try {
        return await TripPlan.findByIdAndUpdate(id, updateData, { new: true });
    }
    catch (error) {
        console.error("Error updating trip plan:", error);
        throw error;
    }
};

export const deleteTripPlan = async (id) => {
    try {
        return await TripPlan.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error deleting trip plan:", error);
        throw error;
    }
};