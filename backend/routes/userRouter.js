import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user-model.js'; 
import postModel from '../models/post-model.js'; 
import Trip from '../models/tripModel.js'; 
import Place from '../models/place.js'; 
import Review  from'../models/Review.js';
import multer from 'multer';
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

import isLoggedIn from '../middlewares/isloggedin.js';

const userRouter = express.Router();

// Users Page Route
userRouter.get('/', (req, res) => {
  res.send('Users page is loaded');
});

// User Registration
userRouter.post('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).send('All input is required');
    }



    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token as cookie
    res.cookie('token', token, { httpOnly: true });
    res.status(201).send('User created');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// User Login
userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('All input is required');
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send('Email or password incorrect');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Email or password incorrect');
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email }, 'highhook', { expiresIn: '1h' });

    // Send token as a cookie
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: 'None' 
    });

    res.status(200).json({ message: 'You are logged in', token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Server error');
  }
});


// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "trip_planner_posts", // Your folder name in Cloudinary
    format: async () => "jpg", // Change format if needed
    public_id: (req, file) => file.originalname.split(".")[0] // Use original filename
  }
});

const upload = multer({ storage });

// Updated Route to Upload Image & Store Cloudinary URL
userRouter.post("/createpost", isLoggedIn, upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    let user = await userModel.findOne({ email: req.user.email });

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    let post = new postModel({
      name,
      description,
      userid: user._id,
      picture: req.file.path // Cloudinary URL
    });

    user.post.push(post._id);
    await post.save();
    await user.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
userRouter.get('/myposts',isLoggedIn, async (req, res) => {
  try {

    let user = await userModel.findOne({ email: req.user.email }).select("fullname email phone post").populate('post');
    res.status(200).json({ post: user.post, fullname: user.fullname, email: user.email, phone: user.phone });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.get('/userdetails', isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email }).select("fullname email phone");
    res.status(200).json({ fullname: user.fullname, email: user.email, phone: user.phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
userRouter.post('/updateprofile', isLoggedIn, async (req, res) => {
  try {
    const { fullname, email, phone } = req.body;
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.get('/mytrips', isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email }).select("fullname email phone trips").populate('trips');
    res.status(200).json({ trips: user.trips, fullname: user.fullname, email: user.email, phone: user.phone }); 
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Server error" });}
});

userRouter.get('/mytrip/:tripId', isLoggedIn, async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.tripId).populate('itinerary.places');
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json({ trip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });}
});

userRouter.post('/deletetrip/:tripId', isLoggedIn, async (req, res) => {
  try {
    let trip = await Trip.findByIdAndDelete(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } 
    let user = await userModel.findOne({ email: req.user.email });
    user.trips = user.trips.filter(t => t.toString() !== trip._id.toString());
    await user.save();
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {   
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.get('/allposts', async (req, res) => {
  try {
    const posts =  await postModel
      .find()
      .populate("userid", "name"); // Only fetch the name field from User

    res.status(200).json({ posts });
  } catch (err) {
    console.error("❌ Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.get('/addReview', async (req, res) => {
  try {
    const { userId, placeId, placeName, rating } = req.body;
    if (!userId || !placeId || !placeName || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newReview = new Review({
      userId,
      placeId,
      placeName,
      rating,
    });
    await newReview.save();
    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


userRouter.post('/likepost/:id',isLoggedIn, async (req, res) => {
  try {
    let post = await postModel.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.status(200).json({ message: "Post liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.post('/posts/addcomment/:id', isLoggedIn, async (req, res) => {
  try {
    const { comment } = req.body;
    let user = await userModel.findOne({ email: req.user.email });

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    let post = await postModel.findById(req.params.id);
    post.comments.push({ userid: user._id, comment });
    await post.save();

    res.status(200).json({ message: "Comment added successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.get('/allposts', async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("userid", "fullName") // populate post creator name
      .populate("comments.userid", "fullName"); // populate commenter names

    res.status(200).json({ posts });
  } catch (err) {
    console.error("❌ Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});



  userRouter.post('/add-review', async (req, res) => {
    try {
      const { userId, placeId, rating } = req.body;
  
      // Validate input
      if (!userId || !placeId || !rating) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Check if rating is within valid range
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
      }
  
      // Create new review
      const newReview = new Review({
        userId,
        placeId,
        rating,
      });
  
      // Save to database
      await newReview.save();
  
      res.status(201).json({ message: "Review added successfully.", review: newReview });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });


// User Logout
userRouter.post('/logout', (req, res) => {
  res.clearCookie('token').send('You are logged out');
});

export default userRouter;
