import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from "cors";


import path from 'path';
import { fileURLToPath } from 'url'; // Needed to fix __dirname issue
import session from 'express-session';
import flash from 'express-flash'; // Import flash properly

import usersRouter from './routes/userRouter.js'; // Add .js for ES modules
//import authRouter from './routes/authRouter.js'; // Add .js for ES modules
import authRouter from './routes/authRouter.js';
//import airoute from './routes/airoutes.js';
import placeRouter from './routes/placeRouter.js';
import airoutes from './routes/airoutes.js';
import dotenv from 'dotenv';
dotenv.config();





// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5555;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'highhook',
    cookie: { maxAge: 60000 },
  })
);
app.use(flash()); // Now properly imported

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use("/api/places", placeRouter);
app.use("/ai", airoutes);

//app.use('/auth', authRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  // .connect('mongodb://127.0.0.1:27017/tripplanner')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Default Route
app.get('/', (req, res) => {
  res.send('<h1>WELCOME AI TRIP PLANNER</h1>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
