import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
//import User from '../models/userModel.js';
import User from '../models/user-model.js';
import OTP from '../models/otp-model.js';
import dotenv from 'dotenv';

const router = express.Router();

// Nodemailer transporter

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
dotenv.config();  // Load environment variables

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,  
  port: process.env.EMAIL_PORT,  
  secure: false, // Use `true` if using port 465 (SSL)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});





// 🔹 Send OTP
router.post('/sendotp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration
    await OTP.create({ email, otp });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Trip Planner OTP Verification',
      text: `Your OTP for Trip planner authentication is: ${otp}. It is valid for 5 minutes. Do not share it with anyone. thanks for visiting our website.`,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

router.post('/resetpassword', async (req, res) => {
  try {
    const { email,otp,newpassword} = req.body;
   // if (!email) return res.status(400).json({ message: 'Email is not required u need to create a new account first' });
     
    if (!email || !newpassword || !otp) {
      return res.status(400).json({ message: 'All input is required' });
    }

    // Check if OTP exists
    const storedOtp = await OTP.findOne({ email, otp });
    if (!storedOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });
    // Ensure OTP is within 5 minutes
    const timeDifference = (Date.now() - storedOtp.createdAt) / 1000; // Convert to seconds
    if (timeDifference > 300) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }
    // Remove OTP after verification
    await OTP.deleteOne({ email });
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'account does not exist u need to create new account first' });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    // update new password
    await User.updateOne({ email },{ $set: { password: hashedPassword } });
    res.status(200).json({ message: 'password updated successfully' });
  } catch (error) {
    console.log(error); 
    res.status(500).json({ message: 'Error updating password' });
  }
});



    let existingUser = await

// 🔹 Verify OTP & Register User
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, password, otp } = req.body;

    if (!fullname || !email || !password || !otp) {
      return res.status(400).json({ message: 'All input is required' });
    }

    // Check if OTP exists
    const storedOtp = await OTP.findOne({ email, otp });
    if (!storedOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Ensure OTP is within 5 minutes
    const timeDifference = (Date.now() - storedOtp.createdAt) / 1000; // Convert to seconds
    if (timeDifference > 300) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Remove OTP after verification
    await OTP.deleteOne({ email });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    // Send JWT as HTTP-only cookie
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
