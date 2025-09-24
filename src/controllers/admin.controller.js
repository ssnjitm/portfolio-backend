import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import uploadToCloudinary from '../utils/cloudinary.js';

// Admin registration (⚠️ should be disabled in production!)
const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, location } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new ApiError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let profileImage = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    profileImage = result.secure_url;
  }

  const admin = await Admin.create({
    email,
    passwordHash,
    fullName,
    phone,
    location,
    profileImage,
  });

  const createdAdmin = await Admin.findById(admin._id).select("-passwordHash");

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the admin");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdAdmin, "Admin registered successfully"));
});

// Admin login (email + password)
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = admin.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          admin: {
            _id: admin._id,
            fullName: admin.fullName,
            email: admin.email,
            phone: admin.phone,
            location: admin.location,
            profileImage: admin.profileImage,
          },
          accessToken,
        },
        "Admin logged in successfully"
      )
    );
});

// Admin logout
const logoutAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

// Get admin profile
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id).select("-passwordHash");

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Admin profile fetched successfully"));
});

// Update admin profile
const updateAdminProfile = asyncHandler(async (req, res) => {
  const { email, password, fullName, phone, location } = req.body;

  const updateData = { email, fullName, phone, location };

  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    updateData.profileImage = result.secure_url;
  }

  const admin = await Admin.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true }
  ).select("-passwordHash");

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Admin profile updated successfully"));
});

// Change password separately
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await admin.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

export {
  changePassword,
  getAdminProfile,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  updateAdminProfile,
};