import cors from "cors";
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/index.js";



// Middleware
app.use(cors({
    origin: true,
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())




// Routes
app.use('/api/v1', router);
// Dummy test route directly on the entry point
app.get("/api/v1/test", (req, res) => {
    res.json({ message: "Backend is reachable!" });
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];
    console.error('API error:', err);

    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors,
        data: err.data ?? null,
    });
});

export default app;
export { app };