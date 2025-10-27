import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Test controller
export const test = (req, res) => {
  return res.send("Hello From Test!");
};

// Signup controller
export const signupController = async (req, res) => {
  try {
    const { username, email, password, address, phone } = req.body;

    // Force public signups to 'user' role server-side (ignore any role field from client)
    const role = 'user';

    if (!username || !email || !password || !address || !phone) {
      return res.status(200).send({
        success: false,
        message: "All fields are required!",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).send({
        success: false,
        message: "User already exists, please login",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
      phone,
      role, // Set role when creating user
    });

    await newUser.save();

    return res.status(201).send({
      message: "User Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error on server!",
    });
  }
};

// Login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body; // Removed role from here, typically role is not needed for login

    if (!email || !password) {
      return res.status(200).send({
        success: false,
        message: "All fields are required!",
      });
    }

    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await jwt.sign(
      { id: validUser._id, role: validUser.role }, // Include role in token
      process.env.JWT_SECRET,
      {
        expiresIn: "4d",
      }
    );
    
    const { password: pass, ...rest } = validUser._doc; // Deselect password to send user data
    // Cookie configuration for both local and production
    const isProduction = process.env.NODE_ENV_CUSTOM ==='production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction || true,       // must be true on Render (HTTPS)
      sameSite:"none", // required for cross-domain
      maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days
      path: "/",
    };
    
    res.cookie("X_TTMS_access_token", token, cookieOptions)
       .status(200)
       .json({
         success: true,
         message: "Login Success",
         user: { ...rest, role: validUser.role },
       });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error on server!",
    });
  }
};

// Logout controller
export const logOutController = (req, res) => {
  try {
    // Clear cookie with same options as login
    const isProduction = process.env.NODE_ENV_CUSTOM === 'production';
    const cookieOptions = {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      // Don't set domain for local development - let browser handle it
      path: '/'
    };
    
    res.clearCookie("X_TTMS_access_token", cookieOptions);
    res.status(200).send({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error during logout!",
    });
  }
};
