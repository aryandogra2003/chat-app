import { generateToken } from "../lib/ustils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { email, fullName, password, profilePic } = req.body;
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      // save user to database
      await newUser.save();
      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      return res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = (req, res) => {
  res.send(`login Page`);
};

export const logout = (req, res) => {
  res.send(`logout Page`);
};
