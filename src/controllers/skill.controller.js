import Skill from '../models/skill.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import uploadToCloudinary from '../utils/cloudinary.js';

// Create skill
const createSkill = asyncHandler(async(req, res) => {
    const { name, category, level } = req.body;

    if (!name) {
        throw new ApiError(400, "Skill name is required");
    }

    let imageUrl = '';
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
    }

    const skill = await Skill.create({
        name,
        category,
        level,
        imageUrl
    });

    return res.status(201)
        .json(new ApiResponse(201, skill, "Skill created successfully"));
});

// Get all skills
const getSkills = asyncHandler(async(req, res) => {
    const skills = await Skill.find().sort({ name: 1 });

    return res.status(200)
        .json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

// Get skills by category
const getSkillsByCategory = asyncHandler(async(req, res) => {
    const { category } = req.params;

    const skills = await Skill.find({ category }).sort({ name: 1 });

    return res.status(200)
        .json(new ApiResponse(200, skills, "Skills fetched by category successfully"));
});

// Update skill
const updateSkill = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { name, category, level } = req.body;

    let imageUrl;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
    }

    const skill = await Skill.findByIdAndUpdate(
        id, {
            $set: {
                ...(imageUrl && { imageUrl }),
                name,
                category,
                level
            }
        }, { new: true }
    );

    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, skill, "Skill updated successfully"));
});

// Delete skill
const deleteSkill = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, {}, "Skill deleted successfully"));
});

export {
    createSkill,
    deleteSkill,
    getSkills,
    getSkillsByCategory,
    updateSkill
};