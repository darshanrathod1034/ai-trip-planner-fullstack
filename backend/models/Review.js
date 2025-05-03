import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "place", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, 
}); 
//export default mongoose.model("Review", ReviewSchema);
const reviewModel = mongoose.model("Review", ReviewSchema);
export default reviewModel;