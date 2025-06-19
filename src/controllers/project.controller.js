import Project from '../models/project.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import uploadToCloudinary from '../utils/cloudinary.js';

// Create project
const createProject = asyncHandler(async(req, res) => {
    const { title, description, githubLink, liveLink, tags } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    let imageUrl = '';
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
    }

    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const project = await Project.create({
        title,
        description,
        imageUrl,
        githubLink,
        liveLink,
        tags: tagArray
    });

    return res.status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});

// Get all projects
const getProjects = asyncHandler(async(req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });

    return res.status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

// Get single project
const getProject = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, project, "Project fetched successfully"));
});

// Update project
const updateProject = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { title, description, githubLink, liveLink, tags } = req.body;

    let imageUrl;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
    }

    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const project = await Project.findByIdAndUpdate(
        id, {
            $set: {
                ...(imageUrl && { imageUrl }),
                title,
                description,
                githubLink,
                liveLink,
                tags: tagArray
            }
        }, { new: true }
    );

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, project, "Project updated successfully"));
});

// Delete project
const deleteProject = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

export {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
};