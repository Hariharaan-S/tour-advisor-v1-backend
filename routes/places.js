import express from "express";
import axios from "axios";
import fs from 'fs'
import { fetchPlaces } from "../utils/places.util.js";

const router = express.Router();

// Get place details by place_id
router.get("/details/:placeId", async (req, res) => {
    const placeId = req.params.placeId;
    const places_array = await fetchPlaces(placeId);
    const filteredArray = places_array.filter((place) => place.place_id === placeId);
    res.json(filteredArray);
});

export default router;
