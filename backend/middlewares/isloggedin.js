import jwt from 'jsonwebtoken';
import userModel from '../models/user-model.js';
import dotenv from 'dotenv';

dotenv.config();

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token ||
                req.headers.authorization?.split(' ')[1] ||
                req.body.token;

  console.log("Auth Debug - Token Source:", {
    cookies: req.cookies.token,
    headers: req.headers.authorization,
    body: req.body.token
  });

  if (!token) {
    console.warn("Auth Failed: No token provided");
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'highhook');
    console.log("Decoded Token:", decoded);

    // Fetch user info
    const user = await userModel.findOne({ email: decoded.email }).select('-password').lean();

    if (!user) {
      console.warn(`Auth Failed: User not found for email ${decoded.email}`);
      return res.status(401).json({
        success: false,
        error: "User account not found"
      });
    }

    // Attach user to request
    req.user = user;
    console.log(`Auth Success: User ${user.email} authenticated`);

    next();
  } catch (error) {
    console.error("Auth Error:", {
      errorName: error.name,
      message: error.message,
      expiredAt: error.expiredAt
    });

    const response = {
      success: false,
      error: "Authentication failed"
    };

    if (error.name === 'TokenExpiredError') {
      response.error = "Session expired. Please login again";
      response.code = "TOKEN_EXPIRED";
    } else if (error.name === 'JsonWebTokenError') {
      response.error = "Invalid token";
      response.code = "INVALID_TOKEN";
    }

    return res.status(401).json(response);
  }
};

export default isLoggedIn;
