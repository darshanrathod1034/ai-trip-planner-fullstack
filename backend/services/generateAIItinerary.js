import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import Trip from "../models/tripModel.js";
import User from "../models/user-model.js";
import { fetchTouristAttractions } from "./osmService.js";

const GOOGLE_DISTANCE_MATRIX_API = "https://maps.googleapis.com/maps/api/distancematrix/json";

//  Helper: Chunked Distance Matrix
const getTravelDistances = async (places) => {
  const locations = places.map(p => `${p.lat},${p.lng}`).filter(Boolean);
  const n = locations.length;
  const max = 10;

  const matrix = Array(n).fill(null).map(() => Array(n).fill(Infinity));

  for (let i = 0; i < n; i += max) {
    for (let j = 0; j < n; j += max) {
      const originChunk = locations.slice(i, i + max);
      const destChunk = locations.slice(j, j + max);

      const res = await axios.get(GOOGLE_DISTANCE_MATRIX_API, {
        params: {
          origins: originChunk.join("|"),
          destinations: destChunk.join("|"),
          key: process.env.GOOGLE_API_KEY,
        },
      });

      if (res.data.status !== "OK" || !res.data.rows) {
        console.error("❌ Distance Matrix Chunk Error:", res.data.error_message);
        throw new Error("Distance matrix failed");
      }

      res.data.rows.forEach((row, rowIdx) => {
        row.elements.forEach((el, colIdx) => {
          const dist = el?.distance?.value ?? Infinity;
          matrix[i + rowIdx][j + colIdx] = dist;
        });
      });
    }
  }

  return matrix;
};

//  Optimize route using Nearest Neighbor
const optimizeDayRoute = (places, distances) => {
  const n = places.length;
  const visited = Array(n).fill(false);
  const route = [0];
  visited[0] = true;

  for (let i = 1; i < n; i++) {
    const last = route[route.length - 1];
    let nearest = -1;
    let minDist = Infinity;

    for (let j = 0; j < n; j++) {
      if (!visited[j] && distances[last][j] < minDist) {
        minDist = distances[last][j];
        nearest = j;
      }
    }

    if (nearest !== -1) {
      route.push(nearest);
      visited[nearest] = true;
    }
  }

  return route.map(index => places[index]);
};

//  Optimize day sequence
const haversineDistance = (a, b) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371e3;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const a1 = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a1), Math.sqrt(1 - a1));
};

const permute = (arr) => {
  if (arr.length <= 1) return [arr];
  const result = [];
  arr.forEach((val, i) => {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (let perm of permute(rest)) result.push([val, ...perm]);
  });
  return result;
};

const reorderDayClusters = (clusters) => {
  const permutations = permute(clusters);
  let bestOrder = clusters;
  let minTotal = Infinity;

  for (const perm of permutations) {
    let total = 0;
    for (let i = 0; i < perm.length - 1; i++) {
      const lastPlace = perm[i][perm[i].length - 1];
      const firstPlace = perm[i + 1][0];
      total += haversineDistance(lastPlace, firstPlace);
    }
    if (total < minTotal) {
      minTotal = total;
      bestOrder = perm;
    }
  }

  return bestOrder;
};

export const generateAIItinerary = async (userId, destination, startDate, endDate, budget, preferences) => {
  try {
    const places = await fetchTouristAttractions(destination, preferences);
    if (!places.length) return null;

    const distances = await getTravelDistances(places);
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24)) + 1;

    const visited = new Set();
    const dayClusters = [];

    for (let day = 1; day <= days; day++) {
      const dayPlan = [];
      let currentIndex = places.findIndex(p => !visited.has(p._id.toString()));
      if (currentIndex === -1) break;

      visited.add(places[currentIndex]._id.toString());
      dayPlan.push(places[currentIndex]);

      let placesAdded = 1;

      while (placesAdded < 3) {
        let closestIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < places.length; i++) {
          if (visited.has(places[i]._id.toString()) || i === currentIndex) continue;
          const dist = distances[currentIndex]?.[i] || Infinity;

          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = i;
          }
        }

        if (closestIndex !== -1 && minDistance < 20000) {
          visited.add(places[closestIndex]._id.toString());
          dayPlan.push(places[closestIndex]);
          currentIndex = closestIndex;
          placesAdded++;
        } else {
          break;
        }
      }

      const dayDistances = await getTravelDistances(dayPlan);
      const optimizedDay = optimizeDayRoute(dayPlan, dayDistances);
      dayClusters.push(optimizedDay);
    }

    const optimizedClusters = reorderDayClusters(dayClusters);
    const itinerary = optimizedClusters.map((cluster, i) => ({
      day: i + 1,
      places: cluster.map(p => p._id)
    }));

    const newTrip = new Trip({
      userId,
      destination,
      startDate,
      endDate,
      budget,
      preferences,
      itinerary,
    });

    const savedTrip = await newTrip.save();
    const user = await User.findById(userId);
    if (user) {
      user.trips.push(savedTrip._id);
      await user.save();
    }

    console.log(" Final Optimized Itinerary:", JSON.stringify(itinerary, null, 2));
    return savedTrip;
  } catch (err) {
    console.error(" AI Itinerary Error:", err.message);
    return null;
  }
};

export default generateAIItinerary;
