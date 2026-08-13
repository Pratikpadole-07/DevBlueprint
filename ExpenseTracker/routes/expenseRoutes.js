import express from "express";

import {
    addTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
    categorySummary,
    monthlyReport
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", addTransaction);

router.get("/", getTransactions);

router.get("/summary/dashboard", getSummary);

router.get("/summary/category", categorySummary);

router.get("/summary/monthly", monthlyReport);

router.get("/:id", getTransaction);

router.put("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

export default router;