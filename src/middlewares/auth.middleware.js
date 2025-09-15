import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
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

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Admin.findById(decodedToken._id).select("-passwordHash");
    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    req.user = user;
    next();
});