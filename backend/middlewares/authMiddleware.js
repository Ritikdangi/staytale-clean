import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to require user sign-in
export const requireSignIn = async (req, res, next) => {
  const token = req?.cookies?.X_TTMS_access_token;
  
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized: Token not provided!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({
        success: false,
        message: "Forbidden",
      });
    }

    req.user = user; // Store user data from token in request
    next();
  });
};

// Admin access middleware
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has admin role (assuming role is a string 'admin' or a number like 1)
    if (user.role === "admin" || user.role === 1) { // Update this check as per your role implementation
      next();
    } else {
      return res.status(403).send({
        success: false,
        message: "Unauthorized Access",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in admin middleware",
      error,
    });
  }
};
