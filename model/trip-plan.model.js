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
    duration: {type: Number},
    fare_band: {type: String},
    distance_km: {type: Number},
    fare_mode: {type: String},
    origin: {type: String},
    destination: {type: String}
})

const instructionSchema = new Schema ({
    day: {type: Number},
    time: {type: String},
    place_name: {type: String},
    description: {type: String},
    location_link: {type: String}
})

const costSummarySchema = new Schema({
    place_cost_per_person: {type: Number},
    travel_cost_per_person: {type: Number},
    total_cost_per_person: {type: Number},
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