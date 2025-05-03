import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  preferences: [{ type: String }], // Example: ["beaches", "historical sites", "nightlife"]
  createdAt: { type: Date, default: Date.now },
  itinerary: [
    {
      day: Number,
      places: [{ type: mongoose.Schema.Types.ObjectId, ref: "place" }],
    },
  ],
});

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
