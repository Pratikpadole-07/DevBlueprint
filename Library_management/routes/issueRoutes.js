import express from "express";

import {
    issueBook,
    returnBook,
    getIssuedBooks,
    getOverdueBooks
} from "../controllers/issueController.js";

const router = express.Router();

// Issue Book
router.post("/", issueBook);

// Get All Issued Books
router.get("/", getIssuedBooks);

// Overdue Books
router.get("/overdue", getOverdueBooks);

// Return Book
router.put("/:id", returnBook);

export default router;