import mongoose from "mongoose";

const { Schema } = mongoose;

const touristSpotsSchema = new Schema({
    name: { type: String, required: true },
    popularity: {type: Number},
    description: {type: String}
})

const transportSchema = new Schema({
    name: {type: String},
    average_cost: {type: Number},
    duration: {type: Number}
})

const instructionSchema = new Schema ({
    day: {type: Number},
    time: {type: String},
    place_name: {type: String},
    location_link: {type: String}
})

const costSummarySchema = new Schema({
    total_cost_for_people: {type: Number},
    people_count: {type: Number},
})

const tripPlanSchema = new Schema({
    planId: {type: String, required: true, unique: true},
    title: { type: String, required: true },
    description: {type: String},
    tourist_spots: [touristSpotsSchema],
    transport: [transportSchema],
    instructions: [instructionSchema],
    cost_summary: costSummarySchema,
    people: {type: Number},
})

const TripPlan = mongoose.model("TripPlan", tripPlanSchema);

export default TripPlan;