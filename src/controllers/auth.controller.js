// controllers/auth.controller.js
import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

export const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email and password are required");

  const existing = await Admin.findOne({ email });
  if (existing) throw new ApiError(409, "Admin already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await Admin.create({ email, passwordHash });
  res.status(201).json(
    new ApiResponse(201, { email: admin.email }, "Admin registered successfully")
  );
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email and password are required");

  const admin = await Admin.findOne({ email });
  if (!admin) throw new ApiError(404, "Invalid credentials");

  const valid = await admin.isPasswordCorrect(password);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const accessToken = admin.generateAccessToken();

  res.status(200).json(
    new ApiResponse(200, { accessToken }, "Login successful")
  );
});