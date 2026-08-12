 import express from "express";

import {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
    Public Routes
*/

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

/*
    Protected Routes
*/

// Get Logged In User
router.get("/profile", protect, getProfile);

// Update Profile
router.put("/profile", protect, updateProfile);

// Change Password
router.put("/change-password", protect, changePassword);

export default router;