import Place from "../models/place.js";

/**
 * Recommend places based on content similarity (Type + City)
 * @param {String} placeId - The current place ID
 */
const getContentBasedRecommendations = async (placeId) => {
  try {
    // Get details of the target place
    const targetPlace = await Place.findById(placeId);
    if (!targetPlace) return [];

    // Find places with the same type AND in the same city
    const similarPlaces = await Place.find({
      type: targetPlace.type, // Ensure same type (e.g., restaurant, beach, etc.)
      city: targetPlace.city, // Ensure same city
      _id: { $ne: placeId } // Exclude the current place itself
    }).limit(30);

    return similarPlaces;
  } catch (error) {
    console.error("Error in Content-Based Filtering:", error);
    return [];
  }
};

export default getContentBasedRecommendations;
