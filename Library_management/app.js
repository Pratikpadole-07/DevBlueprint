import express from "express";

import bookRoutes from "./routes/bookRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

app.use("/api/issues", issueRoutes);

app.get("/", (req, res) => {
    res.send("Library Management API Running...");
});

export default app;