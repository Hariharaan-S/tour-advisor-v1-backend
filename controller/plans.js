import express from "express";
import { fetchDistance, fetchNearbyPlaces, fetchPlaceId } from "../utils/places.util.js";

const planRouter = express.Router();

planRouter.get('/view-plan/:planId', (req, res) => {
    res.json({ message: "Sample Output from Plans Router" })
})

planRouter.post('/make-plan', async (req, res) => {
    const visitPlace = req.body.visitPlace;
    const currentLocation = req.body.currentLocation;
    console.log(visitPlace);
    console.log(currentLocation);
    try {
        const filterPlaces = await fetchPlaceId(visitPlace);
        const distanceMatrix = await fetchDistance(filterPlaces[0]);
        const nearbyPlaces = await fetchNearbyPlaces(filterPlaces[0]);
        const nearbyPlacesId = await Promise.all(nearbyPlaces[0].map(async (place) => await fetchPlaceId(place)))
        var LLMQueryObject = {
            sourcePlaceId: currentLocation,
            visitPlaceId: filterPlaces[0],
            distanceMatrixFromSource: distanceMatrix,
            nearbyPlacesToSource: nearbyPlacesId
        }
        res.status(200).json({ message: "Success", objectToLLM: LLMQueryObject })

    } catch (err) {
        res.status(400).json({ message: err.message })

    }
})

export default planRouter;