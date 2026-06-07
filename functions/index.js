import app from "../src/app.js";
import connectDB from "../src/config/db.config.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Database connection error",
      errors: [],
      data: null,
    });
    return;
  }

  return app(req, res);
}
