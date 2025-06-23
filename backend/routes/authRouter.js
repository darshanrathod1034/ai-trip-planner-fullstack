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
  subject: '🌍 Trip Planner - Your OTP Code',
  html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%); color: #2d3748; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://w0.peakpx.com/wallpaper/740/955/HD-wallpaper-tour-across-world-attractions-culture-travel-visit.jpg" alt="Trip Planner Logo" width="150" style="border-radius: 8px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);" />
  </div>
  
  <h2 style="color: #2b6cb0; font-size: 24px; text-align: center; margin-bottom: 5px;">Your Trip Planner Verification Code</h2>
  <p style="text-align: center; color: #4a5568; margin-bottom: 30px;">Ready to explore the world? First, let's verify your email</p>
  
  <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
    <p style="margin-bottom: 15px; color: #4a5568;">Your one-time verification code:</p>
    
    <div style="display: inline-block; position: relative; margin-bottom: 15px;">
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 2px; padding: 12px 25px; background: #ebf8ff; color: #2b6cb0; border-radius: 8px; display: inline-block; border: 1px dashed #90cdf4;">
        ${otp}
      </div>
      <div style="margin-top: 10px; font-size: 14px; color: #718096;">
        (Select and copy this code manually)
      </div>
    </div>
    
    <p style="font-size: 14px; color: #718096; margin-bottom: 0;">This code expires in <strong style="color: #e53e3e;">5 minutes</strong></p>
  </div>
  
  <div style="text-align: center; margin-bottom: 25px;">
    <p style="color: #4a5568;">Simply enter this code in the verification screen to continue your travel planning journey.</p>
  </div>
  
  <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
    <p style="font-size: 12px; color: #718096; margin-bottom: 5px;">Having trouble? Try requesting a new code.</p>
    <p style="font-size: 12px; color: #718096;">For security reasons, do not share this code with anyone.</p>
  </div>
  
  <footer style="text-align: center; margin-top: 30px;">
    <p style="font-size: 12px; color: #a0aec0;">© 2025 Trip Planner. All rights reserved.</p>
    <p style="font-size: 12px; color: #a0aec0;">Explore the world with confidence</p>
  </footer>
</div>
`
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
