import express from "express";
import  getHybridRecommendations  from "../services/hybridRecommendation.js";
import generateAIItinerary  from "../services/generateAIItinerary.js";
import userModel from "../models/user-model.js";
import Place from "../models/place.js";
//import { fetchTouristAttractions } from "../services/osmService.js"; // Fetch places
const airouters = express.Router();

// Recommend places using Hybrid AI System
airouters.post("/recommend",isLoggedIn, async (req, res) => {
  try {
    let userId = await userModel.findOne({ email: req.user.email });
    const { destination, startDate, endDate, budget, preferences } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Missing required parameters" });
    }

    // Call AI itinerary function
    let aiResponse = await generateAIItinerary(userId, destination, startDate, endDate, budget, preferences);
if (!aiResponse || !aiResponse.itinerary) {
  return res.status(500).json({ error: "Itinerary generation failed" });
}
    console.log("Generated Itinerary:", aiResponse);

    // ✅ Extract `itinerary` array from the returned object
    let recommendations = aiResponse.itinerary || [];

    // ✅ Ensure it's an array
    if (!Array.isArray(recommendations)) {
      console.error("❌ Error: itinerary is not an array!");
      recommendations = [];
    }

    // ✅ Populate places before returning
    for (let day of recommendations) {
      if (day.places && Array.isArray(day.places)) {
        day.places = await Place.find({ _id: { $in: day.places } });
      }
    }

    res.json({ success: true, recommendations });
  } catch (error) {
    console.error("❌ Error in Recommendations API:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


import Trip from "../models/tripModel.js";
import isLoggedIn from "../middlewares/isloggedin.js";

export const recommendPlacesForUser = async (userId, destination, preferences) => {
  try {
    let userTrips = await Trip.find({ userId });
    let similarTrips = await Trip.find({
      destination,
      preferences: { $in: preferences },
    });

    let visitedPlaces = userTrips.flatMap((trip) => trip.itinerary.flatMap((d) => d.places));
    let recommendedPlaces = similarTrips
      .flatMap((trip) => trip.itinerary.flatMap((d) => d.places))
      .filter((place) => !visitedPlaces.includes(place));

    return recommendedPlaces;
  } catch (error) {
    console.error("❌ Recommendation Error:", error.message);
    return [];
  }
};


//export { router };

export default airouters;