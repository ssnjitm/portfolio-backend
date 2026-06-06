import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.config.js";

dotenv.config();

// Define port with a fallback fallback
const PORT = process.env.PORT || 5000;

// Connection to MongoDB
connectDB()
    .then(() => {
        // REMOVED '0.0.0.0' so Vercel can handle the hostname binding automatically
        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Mongodb connection failed !!!", err);
    });