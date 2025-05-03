import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    post: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'post'  // ✅ Matches model name exactly
    }],
    saved_places: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'place'  // Ensure it matches the place model
     }],
     preferences: [String], // ["beaches", "adventure", "history"]
     trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
    phone: Number
});

const userModel = mongoose.model('users', userSchema);  // ✅ Keep as 'users'
export default userModel;
