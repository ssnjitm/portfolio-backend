import cors from "cors";
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });






// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())



import router from "./routes/index.js";
// Routes
app.use('/api/v1', router);

export { app };