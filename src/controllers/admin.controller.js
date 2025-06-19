import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import uploadToCloudinary from '../utils/cloudinary.js';

// Admin registration
const registerAdmin = asyncHandler(async(req, res) => {
    const { username, password, fullName, email, phone, location } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
        throw new ApiError(409, "Username already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let profileImage = '';
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        profileImage = result.secure_url;
    }

    const admin = await Admin.create({
        username,
        passwordHash,
        fullName,
        email,
        phone,
        location,
        profileImage,
        socialLinks: {}
    });

    const createdAdmin = await Admin.findById(admin._id).select("-passwordHash");

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin");
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered successfully")
    );
});

// Admin login
const loginAdmin = asyncHandler(async(req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = jwt.sign({ _id: admin._id, username: admin.username },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, {
                admin: {
                    _id: admin._id,
                    username: admin.username,
                    fullName: admin.fullName,
                    email: admin.email,
                    profileImage: admin.profileImage
                },
                accessToken
            }, "Admin logged in successfully")
        );
});

// Admin logout
const logoutAdmin = asyncHandler(async(req, res) => {
    return res.status(200)
        .clearCookie("accessToken")
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

// Get admin profile
const getAdminProfile = asyncHandler(async(req, res) => {
    const admin = await Admin.findById(req.user._id).select("-passwordHash");

    return res.status(200)
        .json(new ApiResponse(200, admin, "Admin profile fetched successfully"));
});

// Update admin profile
const updateAdminProfile = asyncHandler(async(req, res) => {
    const { fullName, email, phone, location, socialLinks } = req.body;

    let profileImage = req.user.profileImage;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        profileImage = result.secure_url;
    }

    const admin = await Admin.findByIdAndUpdate(
        req.user._id, {
            $set: {
                fullName,
                email,
                phone,
                location,
                profileImage,
                socialLinks: socialLinks ? JSON.parse(socialLinks) : req.user.socialLinks
            }
        }, { new: true }
    ).select("-passwordHash");

    return res.status(200)
        .json(new ApiResponse(200, admin, "Admin profile updated successfully"));
});

// In your Change password controller, you can use bcrypt to hash the new password and compare the current password
const changePassword = asyncHandler(async(req, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
        throw new ApiError(400, "Current password is incorrect");
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.status(200).json(
        new ApiResponse(200, null, "Password changed successfully")
    );
});

export {
    changePassword,
    getAdminProfile,
    loginAdmin,
    logoutAdmin,
    registerAdmin,
    updateAdminProfile
};