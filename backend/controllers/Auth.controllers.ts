import { Request, Response } from "express";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    req.session.isLoggedIn = true;
    req.session.userId = newUser._id;

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "User creation failed" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.isLoggedIn = true;
    req.session.userId = user._id;

    return res
      .status(200)
      .json({ message: "User loginned successfully", user });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Logout failed" });
      }
      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Logout failed" });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User verified successfully", user });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "User verification failed" });
  }
};
