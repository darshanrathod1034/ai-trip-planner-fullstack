import express from "express";
import { fetchTouristAttractions } from "../services/osmService.js"; // Fetch places
import place from "../models/place.js"; // Import Mongoose model

const placeRouter = express.Router();

placeRouter.get("/fetch/:city", async (req, res) => {
  try {
    const city = req.params.city;
    let places = await fetchTouristAttractions(city);

    if (!places || places.length === 0) {
      return res.status(404).json({ success: false, message: "No places found" });
    }

    console.log("📌 Places to be stored in DB:", places); // ✅ Debugging log

    // Store fetched places in MongoDB (Avoid duplicates)
    await place.insertMany(places, { ordered: false })
      .then(() => console.log("✅ Places successfully stored in DB"))
      .catch(err => console.log("⚠️ Some places already exist, skipping duplicates...", err));

    res.json({ success: true, data: places });
  } catch (error) {
    console.error("❌ Backend API Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default placeRouter;
