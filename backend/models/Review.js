import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  review: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
  placeName: { type: String, required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "place", },
  rating: { type: Number, required: true, min: 1, max: 5 }, 
}); 
//export default mongoose.model("Review", ReviewSchema);
const reviewModel = mongoose.model("Review", ReviewSchema);
export default reviewModel;