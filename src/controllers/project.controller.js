import Project from '../models/project.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import uploadToCloudinary from '../utils/cloudinary.js';

// Create project
const createProject = asyncHandler(async(req, res) => {
    const { title, description, githubLink, liveLink, techstack } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    let imageUrl = '';
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
    }

    const tagArray = techstack
        ? (Array.isArray(techstack) ? techstack : techstack.split(',').map(t => t.trim()).filter(Boolean))
        : [];

    const project = await Project.create({
        title,
        description,
        imageUrl,
        githubLink,
        liveLink,
        techstack: tagArray
    });

    return res.status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});

// Get all projects
const getProjects = asyncHandler(async(req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });

    // Normalize techstack for old documents that used 'teckstack' (typo) or stored as string
    const normalized = projects.map(p => {
        const doc = p.toObject();
        // merge old teckstack typo into techstack
        const raw = doc.techstack ?? doc.teckstack;
        if (Array.isArray(raw)) {
            doc.techstack = raw;
        } else if (typeof raw === 'string' && raw.trim()) {
            doc.techstack = raw.split(',').map(t => t.trim()).filter(Boolean);
        } else {
            doc.techstack = [];
        }
        return doc;
    });

    return res.status(200)
        .json(new ApiResponse(200, normalized, "Projects fetched successfully"));
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
    const { title, description, githubLink, liveLink, techstack } = req.body;

    let imageUrl;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
    }

    const tagArray = techstack
        ? (Array.isArray(techstack) ? techstack : techstack.split(',').map(t => t.trim()).filter(Boolean))
        : [];

    const project = await Project.findByIdAndUpdate(
        id, {
            $set: {
                ...(imageUrl && { imageUrl }),
                title,
                description,
                githubLink,
                liveLink,
                techstack: tagArray
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