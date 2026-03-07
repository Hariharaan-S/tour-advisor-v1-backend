import mongoose from "mongoose";

const { Schema } = mongoose;

const userPlansSchema = new Schema({
    userId: { type: String, required: true },
    planId: [{ type: String, required: true }],
    trackedAt: { type: Date, default: Date.now }
});

const UserPlans = mongoose.model("UserPlans", userPlansSchema);

export default UserPlans;