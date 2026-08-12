import express from "express";

import {
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart,
    clearCart
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
    All Cart Routes are Protected
*/

// View Cart
router.get("/", protect, getCart);

// Add Product To Cart
router.post("/", protect, addToCart);

// Update Product Quantity
router.put("/:productId", protect, updateQuantity);

// Remove Product From Cart
router.delete("/:productId", protect, removeFromCart);

// Clear Entire Cart
router.delete("/", protect, clearCart);

export default router;