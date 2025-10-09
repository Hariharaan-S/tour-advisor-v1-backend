import { readFile } from "fs/promises";   // <-- important


export const fetchPlaces = async () => {
    try {
        const data = await readFile('D:/Trip Planner 1.0/json files/places.json', 'utf8');
        const places_array = JSON.parse(data).data;
        return places_array;
    } catch (err) {
        return err;
    }
}

export const fetchPlaceId = async (place) => {
    try {
        const data = await readFile(
            "D:/Trip Planner 1.0/json files/placeId.json",
            "utf-8"
        );
        const placeIds = JSON.parse(data).data;
        const filteredPlaces = placeIds.filter(
            (p) => p.name.toLowerCase().includes(place.toLowerCase())
        ).map((p) => p.place_id);
        return filteredPlaces;
    } catch (err) {
        return { error: err.message };
    }
};

export const fetchDistance = async (placeId) => {
    try {
        const data = await readFile('D:/Trip Planner 1.0/json files/distance_matrix.json')
        const distanceMatrix = JSON.parse(data);
        const placesIds = distanceMatrix.places;
        let placeIndex = placesIds.indexOf(placeId);
        if (placeIndex === -1) {
            return [];
        }
        return { placesId: placesIds, source_dest_dist_matrix: distanceMatrix.matrix[placeIndex] };
    } catch (error) {
        return [];
    }
}

export const fetchNearbyPlaces = async (placeId) => {
    const place_array = await fetchPlaces();
    const fileredPlaces = place_array.filter((place) => place.place_id === placeId);
    return fileredPlaces.map(el => el.nearby);
}
