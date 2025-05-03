import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  address: { type: String, required: true },
  types: [{ type: String }],
  popularity: Number, // Based on user visits
  usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], //
});

//export default mongoose.model("Place", placeSchema);

const placeModel = mongoose.model('place', placeSchema);
export default placeModel;
