import express from "express";
import cors from "cors";

import bookRoutes from "./routes/bookRoutes.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// -------------------------
// Global middleware
// -------------------------

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// Health / root route
// -------------------------

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Library Book Inventory API is running",
        data: {
            status: "OK",
            service: "Library Book Inventory API"
        }
    });
});

// -------------------------
// API routes
// -------------------------

app.use("/api/books", bookRoutes);

// -------------------------
// 404 handler
// -------------------------

app.use(notFoundMiddleware);

// -------------------------
// Global error handler
// -------------------------

app.use(errorMiddleware);

export default app;