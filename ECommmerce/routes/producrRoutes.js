import express from "express";

import {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

/*
    Public Routes
*/

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProduct);

/*
    Protected Admin Routes
*/

// Add Product
router.post("/", protect, isAdmin, addProduct);

// Update Product
router.put("/:id", protect, isAdmin, updateProduct);

// Delete Product
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;