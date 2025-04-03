import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected Route
router.get("/profile", isAuthenticated, getUserProfile);

export default router;
