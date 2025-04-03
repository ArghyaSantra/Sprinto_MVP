import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

// ✅ Register a New User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get User Profile (Requires Auth)
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from middleware
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
