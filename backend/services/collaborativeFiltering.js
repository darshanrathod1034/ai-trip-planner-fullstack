import _ from "lodash";
import Review from "../models/Review.js";
import Place from "../models/place.js";

/**
 * Recommend places using Collaborative Filtering (User-Based + City-Based)
 * @param {String} userId - The user ID
 */
const getUserBasedRecommendations = async (userId) => {
  try {
    // Get all reviews
    const allReviews = await Review.find().populate("placeId");

    // Group reviews by user
    const userRatings = _.groupBy(allReviews, "userId");

    // Get places reviewed by the target user
    const userReviewedPlaces = userRatings[userId]?.map((r) => r.placeId) || [];

    if (userReviewedPlaces.length === 0) {
      console.log("User has no reviewed places. No recommendations.");
      return [];
    }

    // Extract the user's preferred city (based on first reviewed place)
    const preferredCity = userReviewedPlaces[0]?.city?.toLowerCase(); // Normalize case

    console.log(`Preferred city for user ${userId}:`, preferredCity);

    // Find similar users (users who rated the same places)
    let similarUsers = [];
    for (let [otherUser, reviews] of Object.entries(userRatings)) {
      if (otherUser !== userId) {
        const commonPlaces = reviews.filter((r) =>
          userReviewedPlaces.some((ur) => ur._id.equals(r.placeId._id))
        );

        if (commonPlaces.length > 0) {
          similarUsers.push({ userId: otherUser, commonPlaces });
        }
      }
    }

    // Sort by most common places
    similarUsers = _.sortBy(similarUsers, (u) => -u.commonPlaces.length);

    console.log("Similar users found:", similarUsers.map((u) => u.userId));

    // Recommend places that similar users liked, but only in the same city
    let recommendedPlaces = [];
    for (let similarUser of similarUsers) {
      for (let review of userRatings[similarUser.userId]) {
        const placeCity = review.placeId.city?.toLowerCase(); // Normalize case

        if (
          review.rating >= 5 && // Only recommend highly rated places
          !userReviewedPlaces.some((ur) => ur._id.equals(review.placeId._id)) &&
          placeCity === preferredCity // Ensure the place is in the same city
        ) {
          recommendedPlaces.push(review.placeId);
        }
      }
    }

    recommendedPlaces = _.uniqBy(recommendedPlaces, "_id"); // Remove duplicate places

    console.log("Final Recommended Places:", recommendedPlaces.map((p) => p.name));

    return recommendedPlaces;
  } catch (error) {
    console.error("Error in Collaborative Filtering:", error);
    return [];
  }
};

export default getUserBasedRecommendations;
