import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Missing required environment variable MONGODB_URI");
}

const getConnectionString = () => {
  const trimmed = MONGODB_URI.replace(/\/+$/, "");
  return trimmed.endsWith(`/${DB_NAME}`) ? trimmed : `${trimmed}/${DB_NAME}`;
};

const connectDB = async () => {
  const connectionString = getConnectionString();

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (global._mongoConnectionPromise) {
    return global._mongoConnectionPromise;
  }

  global._mongoConnectionPromise = mongoose
    .connect(connectionString)
    .then((mongooseInstance) => {
      console.log(`MongoDB connected !! DB HOST :${mongooseInstance.connection.host}`);
      return mongooseInstance.connection;
    })
    .catch((error) => {
      console.error("MONGODB CONNECTION ERROR", error);
      global._mongoConnectionPromise = null;
      throw error;
    });

  return global._mongoConnectionPromise;
};

export default connectDB;