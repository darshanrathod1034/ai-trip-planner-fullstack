import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  userid: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true 
  },
  picture: { type: String, required: true }, // ✅ Now this stores Cloudinary URL
  likes: { type: Number, default: 0 },
   likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  comments: [{
    userid: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users', 
      required: true 
    },
    comment: { type: String, required: true }
  }]
}, { timestamps: true });

const postModel = mongoose.model('post', postSchema);
export default postModel;
