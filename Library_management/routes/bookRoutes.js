import express from "express";

import {
    addBook,
    getBooks,
    getBook,
    updateBook,
    deleteBook,
    getAvailableBooks
} from "../controllers/bookController.js";

const router = express.Router();

// Static Routes
router.get("/available", getAvailableBooks);

// CRUD
router.post("/", addBook);

router.get("/", getBooks);

router.get("/:id", getBook);

router.put("/:id", updateBook);

router.delete("/:id", deleteBook);

export default router;