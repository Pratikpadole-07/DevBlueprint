import Book from "../models/Book.js";

export const addBook = async (req, res) => {
    try {

        const {
            title,
            author,
            category,
            isbn,
            totalCopies
        } = req.body;

        if (
            !title ||
            !author ||
            !category ||
            !isbn ||
            !totalCopies
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check duplicate ISBN
        const existingBook = await Book.findOne({ isbn });

        if (existingBook) {
            return res.status(400).json({
                message: "Book already exists"
            });
        }

        const book = await Book.create({
            title,
            author,
            category,
            isbn,
            totalCopies,
            availableCopies: totalCopies
        });

        res.status(201).json({
            message: "Book Added Successfully",
            book
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const getBooks = async (req, res) => {

    try {

        const books = await Book.find()
            .sort({ createdAt: -1 });

        res.json(books);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const getBook = async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if (!book) {

            return res.status(404).json({
                message: "Book Not Found"
            });

        }

        res.json(book);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const updateBook = async (req, res) => {

    try {

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!book) {

            return res.status(404).json({
                message: "Book Not Found"
            });

        }

        res.json({
            message: "Book Updated",
            book
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const deleteBook = async (req, res) => {

    try {

        const book = await Book.findByIdAndDelete(
            req.params.id
        );

        if (!book) {

            return res.status(404).json({
                message: "Book Not Found"
            });

        }

        res.json({
            message: "Book Deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const getAvailableBooks = async (req, res) => {

    try {

        const books = await Book.find({
            availableCopies: {
                $gt: 0
            }
        });

        res.json(books);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

