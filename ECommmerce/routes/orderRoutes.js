import express from "express";

import {
    placeOrder,
    getOrders,
    getOrder,
    cancelOrder
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
    All Order Routes are Protected
*/

// Place Order
router.post("/", protect, placeOrder);

// Get Logged In User Orders
router.get("/", protect, getOrders);

// Get Order By Id
router.get("/:id", protect, getOrder);

// Cancel Order
router.put("/:id/cancel", protect, cancelOrder);

export default router;