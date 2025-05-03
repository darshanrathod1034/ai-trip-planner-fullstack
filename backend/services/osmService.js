import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import Place from "../models/place.js";

const GOOGLE_PLACES_API = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const GOOGLE_TEXT_SEARCH_API = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const GOOGLE_GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json";

const placeTypeMapping = {
  nature: ["beach", "natural_feature", "park"],
  history: ["hindu_temple", "museum", "historical_landmark"],
  nightlife: ["night_club", "casino"],
  shopping: ["shopping_mall"],
  entertainment: ["amusement_park"],
};

// Convert destination name to lat/lng
const getCoordinates = async (destination) => {
  try {
    const response = await axios.get(GOOGLE_GEOCODE_API, {
      params: {
        address: destination,
        key: process.env.GOOGLE_API_KEY,
      },
    });

    if (response.data.status !== "OK") return null;
    return response.data.results[0].geometry.location;
  } catch (error) {
    console.error(" Error getting coordinates:", error.message);
    return null;
  }
};




export const fetchTouristAttractions = async (destination, preferences) => {
  try {
    const location = await getCoordinates(destination);
    if (!location) return [];

    const allPlaces = [];

    //  Step 1: Fetch top sights using Text Search API
    const textSearchRes = await axios.get(GOOGLE_TEXT_SEARCH_API, {
      params: {
        query: `top sights in ${destination}`,
        key: process.env.GOOGLE_API_KEY,
      },
    });

    if (textSearchRes.data.status === "OK") {
      allPlaces.push(
        ...textSearchRes.data.results.map((place) => ({
          name: place.name,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          rating: place.rating || 0,
          address: place.formatted_address || "N/A",
          types: place.types,
        }))
      );
    }

    //  Step 2: Fetch based on user preferences (optional enrichment)
    let selectedTypes = [];
    preferences.forEach((pref) => {
      if (placeTypeMapping[pref]) selectedTypes.push(...placeTypeMapping[pref]);
    });

    const uniqueTypes = [...new Set(selectedTypes)];

    for (const type of uniqueTypes) {
      const res = await axios.get(GOOGLE_PLACES_API, {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: 5000,
          type,
          key: process.env.GOOGLE_API_KEY,
        },
      });

      if (res.data.status !== "OK") continue;

      allPlaces.push(
        ...res.data.results.map((place) => ({
          name: place.name,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          rating: place.rating || 0,
          address: place.vicinity || "N/A",
          types: place.types,
        }))
      );
    }

    //  Filter duplicates and low-rated places (below 3.5)
    const uniquePlacesMap = new Map();
    allPlaces.forEach((place) => {
      if (place.rating < 3.5) return; // Skip low-rated places

      const key = `${place.name}-${place.address}`;
      if (!uniquePlacesMap.has(key)) {
        uniquePlacesMap.set(key, place);
      }
    });

    const uniquePlaces = Array.from(uniquePlacesMap.values());

    // Sort by rating (highest first)
    //uniquePlaces.sort((a, b) => b.rating - a.rating);

    // Save to DB
    const savedPlaces = await Promise.all(
      uniquePlaces.map(async (place) => {
        const existing = await Place.findOne({ name: place.name, address: place.address });
        if (existing) return existing;
        const newPlace = new Place(place);
        return await newPlace.save();
      })
    );

    return savedPlaces;
  } catch (err) {
    console.error(" Fetching Places Error:", err.message);
    return [];
  }
};
