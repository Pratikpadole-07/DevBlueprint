import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
        },

        studentId: {
            type: String,
            required: true,
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        issueDate: {
            type: Date,
            default: Date.now,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        returnDate: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["Issued", "Returned"],
            default: "Issued",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Issue", issueSchema);