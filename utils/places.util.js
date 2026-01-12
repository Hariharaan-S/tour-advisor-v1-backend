import { readFile } from "fs/promises";   // <-- important
const directoryName = 'D:/tour-adivisor-1.0/Dev code/rag+llm(tour advisor)/rag_llm_dev/json files';

export const fetchPlaces = async () => {
    try {
        const data = await readFile(directoryName + 'places.json', 'utf8');
        const places_array = JSON.parse(data).data;
        return places_array;
    } catch (err) {
        return err;
    }
}

export const fetchPlaceId = async (place) => {
    try {
        const data = await readFile(
            directoryName + "placeId.json",
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

export const fetchDistance = async () => {
    try {
        const data = await readFile(directoryName + 'distance_matrix.json')
        const distanceMatrix = JSON.parse(data);
        return distanceMatrix;
    } catch (err) {
        return [];
    }
}

export const fetchDistanceById = async (placeId) => {
    try {
        const data = await readFile(directoryName + 'distance_matrix.json')
        const distanceMatrix = JSON.parse(data);
        const placesIds = distanceMatrix.places;
        let placeIndex = placesIds.indexOf(placeId);
        if (placeIndex === -1) {
            return [];
        }

        console.log({ placesId: placesIds, source_dest_dist_matrix: distanceMatrix.matrix[placeIndex] });

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


export const fetchTransportDetailsFromSource = async (sourceId) => {
    // normalize to array of ids
    const srcIds = Array.isArray(sourceId) ? sourceId : [sourceId];

    const result = await readFile(directoryName + 'transport_distance.json');
    const res = JSON.parse(result).data;

    // Filter entries where src_place_id exists in the provided ids
    const fileredMatrixArray = res.filter(place => {
        console.log("Comparing:", place.src_place_id, "with", srcIds);
        return srcIds.includes(place.src_place_id);
    });

    console.log('====================================');
    console.log(fileredMatrixArray);
    console.log('====================================');
    return fileredMatrixArray;
}

export const getPath = (prev, start, end, maxDepth = 100) => {
    // reconstruct single path from end to start using prev mapping
    const paths = [];
    const visited = {};
    let planCount = 0;
    while (planCount < 5) {
        let current = end;
        if (visited.current === null || visited.current === undefined) {
            visited.current = 0;
        }
        const path = [];
        let depth = 0;
        while (current !== null && current !== undefined && visited?.current < 2 && depth < maxDepth) {
            path.unshift(current);
            if (current === start) break;
            visited.current += 1;
            current = prev[current];
            depth += 1;
        }

        paths.push(path);
        planCount += 1;
    }
    if (paths.length === 0) return [];
    return paths;
}
// ...existing code...

// export const dijkstra = async (graph, start) => {
//     const dist = {};
//     const prev = {};
//     const visited = {};

//     for (const node in graph) {
//         dist[node] = Infinity;
//         prev[node] = null;
//     }

//     // normalize start if it's an array
//     const startNode = Array.isArray(start) ? start[0] : start;
//     dist[startNode] = 0;

//     const pq = new MinPriorityQueue(x => x.cost);
//     pq.enqueue({ node: startNode, cost: 0 });

//     while (!pq.isEmpty()) {
//         const { node: dequeuedNode, cost } = pq.dequeue();
//         // normalize dequeued node (sometimes nodes are arrays)
//         const nodeVal = Array.isArray(dequeuedNode) ? dequeuedNode[0] : dequeuedNode;

//         if (visited[nodeVal]) continue;
//         visited[nodeVal] = true;

//         console.log("Node: ", nodeVal);

//         // IMPORTANT: fetch transport details for CURRENT node
//         const distanceCostMatrix = await fetchTransportDetailsFromSource(nodeVal);
//         console.log("DistanceCostMatrix, ", distanceCostMatrix);

//         // Safety check: skip if graph missing this node
//         if (!graph[nodeVal]) {
//             continue;
//         }

//         for (const edge of graph[nodeVal]) {
//             const nextRaw = edge.neighbor;
//             const next = Array.isArray(nextRaw) ? nextRaw[0] : nextRaw;

//             // find edge details for current node -> next
//             const edgeDetails = distanceCostMatrix.find(
//                 place => place.dest_place_id === next
//             );
//             console.log("edgeDetails: ", edgeDetails);

//             if (!edgeDetails) continue;

//             const baseCost = edge.cost ?? 0;

//             let extraModeCost = Infinity;
//             for (const stop of edgeDetails.nearby_stops || []) {
//                 extraModeCost = Math.min(extraModeCost, stop.cost ?? Infinity);
//             }

//             const newCost = cost + baseCost + (extraModeCost === Infinity ? 0 : extraModeCost);

//             if (newCost < dist[next]) {
//                 dist[next] = newCost;
//                 prev[next] = nodeVal;
//                 pq.enqueue({ node: next, cost: newCost });
//             }
//         }
//     }

//     return { dist, prev };
// };
