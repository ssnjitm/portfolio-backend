// auth.middleware.js
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    let token = null;

    // Get from cookies if available
    if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    // Get from Authorization header if not found in cookies
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7).trim();
        }
    }

    if (!token) {
        throw new ApiError(401, "Unauthorized access");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await Admin.findById(decodedToken._id).select("-passwordHash");
        if (!user) {
            throw new ApiError(401, "Unauthorized access");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Check if refresh token is available
            await handleTokenRefresh(req, res, next);
        } else {
            throw new ApiError(401, "Invalid token");
        }
    }
    
});

// Refresh token handler
const handleTokenRefresh = asyncHandler(async (req, res, next) => {
    let refreshToken = null;

    // Get refresh token from cookies or headers
    if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
    } else if (req.headers['x-refresh-token']) {
        refreshToken = req.headers['x-refresh-token'];
    }

    if (!refreshToken) {
        throw new ApiError(401, "Token expired. Please log in again.");
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await Admin.findById(decodedRefresh._id).select("-passwordHash");
        
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
        );

        // Set new access token in response cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        // Set user in request and continue
        req.user = user;
        next();
    } catch (refreshError) {
        throw new ApiError(401, "Refresh token expired. Please log in again.");
    }
});