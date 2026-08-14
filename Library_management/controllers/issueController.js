import Book from "../models/Book.js";
import Issue from "../models/Issue.js";

export const issueBook = async (req, res) => {

    try {

        const {
            studentName,
            studentId,
            bookId,
            dueDate
        } = req.body;

        if (
            !studentName ||
            !studentId ||
            !bookId ||
            !dueDate
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check book
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Copies available?
        if (book.availableCopies <= 0) {
            return res.status(400).json({
                message: "Book not available"
            });
        }

        // Prevent duplicate issue
        const alreadyIssued = await Issue.findOne({
            studentId,
            book: bookId,
            status: "Issued"
        });

        if (alreadyIssued) {
            return res.status(400).json({
                message: "Book already issued to this student"
            });
        }

        const issue = await Issue.create({

            studentName,

            studentId,

            book: bookId,

            dueDate

        });

        book.availableCopies--;

        await book.save();

        res.status(201).json({

            message: "Book Issued Successfully",

            issue

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

export const returnBook = async (req, res) => {

    try {

        const issue = await Issue.findById(req.params.id);

        if (!issue) {

            return res.status(404).json({
                message: "Issue Record Not Found"
            });

        }

        if (issue.status === "Returned") {

            return res.status(400).json({
                message: "Book Already Returned"
            });

        }

        issue.status = "Returned";

        issue.returnDate = new Date();

        await issue.save();

        const book = await Book.findById(issue.book);

        book.availableCopies++;

        await book.save();

        res.json({

            message: "Book Returned Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

export const getIssuedBooks = async (req, res) => {

    try {

        const issues = await Issue.find()

            .populate("book")

            .sort({ createdAt: -1 });

        res.json(issues);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

export const getOverdueBooks = async (req, res) => {

    try {

        const today = new Date();

        const overdue = await Issue.find({

            dueDate: {

                $lt: today

            },

            status: "Issued"

        }).populate("book");

        res.json(overdue);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};