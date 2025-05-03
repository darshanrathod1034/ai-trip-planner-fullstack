import  getUserBasedRecommendations  from "./collaborativeFiltering.js";
import  getContentBasedRecommendations  from "./contentFiltering.js";

/**
 * Hybrid Recommendation System (User + Content)
 * @param {String} userId - The user ID
 * @param {String} placeId - The last visited place ID
 */
 const getHybridRecommendations = async (userId, placeId) => {
  try {
    const userRecommendations = await getUserBasedRecommendations(userId);
    const contentRecommendations = await getContentBasedRecommendations(placeId);

    // Combine both lists and remove duplicates
    const hybridRecommendations = [...userRecommendations, ...contentRecommendations];
    
    return [...new Map(hybridRecommendations.map((item) => [item._id.toString(), item])).values()];
  } catch (error) {
    console.error("Error in Hybrid Recommendations:", error);
    return [];
  }
};

export default getHybridRecommendations;
