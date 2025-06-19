import Experience from '../models/experience.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import uploadToCloudinary from '../utils/cloudinary.js';

// Create experience
const createExperience = asyncHandler(async(req, res) => {
    const { role, companyName, description, from, to, current } = req.body;

    if (!role || !companyName) {
        throw new ApiError(400, "Role and company name are required");
    }

    let jobThumbnail = '';
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        jobThumbnail = result.secure_url;
    }

    const experience = await Experience.create({
        jobThumbnail,
        role,
        companyName,
        description,
        from,
        to,
        current: current === 'true'
    });

    return res.status(201)
        .json(new ApiResponse(201, experience, "Experience created successfully"));
});

// Get all experiences
const getExperiences = asyncHandler(async(req, res) => {
    const experiences = await Experience.find().sort({ from: -1 });

    return res.status(200)
        .json(new ApiResponse(200, experiences, "Experiences fetched successfully"));
});

// Get single experience
const getExperience = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const experience = await Experience.findById(id);
    if (!experience) {
        throw new ApiError(404, "Experience not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, experience, "Experience fetched successfully"));
});

// Update experience
const updateExperience = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { role, companyName, description, from, to, current } = req.body;

    let jobThumbnail;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        jobThumbnail = result.secure_url;
    }

    const experience = await Experience.findByIdAndUpdate(
        id, {
            $set: {
                ...(jobThumbnail && { jobThumbnail }),
                role,
                companyName,
                description,
                from,
                to,
                current: current === 'true'
            }
        }, { new: true }
    );

    if (!experience) {
        throw new ApiError(404, "Experience not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, experience, "Experience updated successfully"));
});

// Delete experience
const deleteExperience = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
        throw new ApiError(404, "Experience not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, {}, "Experience deleted successfully"));
});

export {
    createExperience,
    getExperiences,
    getExperience,
    updateExperience,
    deleteExperience
};