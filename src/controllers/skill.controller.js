// controllers/skill.controller.js
import Skill from "../models/skill.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadToCloudinary from "../utils/cloudinary.js";

const createSkill = asyncHandler(async (req, res) => {
  const { title, description, level, experience } = req.body;
  if (!title) throw new ApiError(400, "Skill title is required");

  let iconUrl = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    iconUrl = result.secure_url;
  }

  const skill = await Skill.create({ title, description, level, experience, iconUrl });

  return res.status(201).json(new ApiResponse(201, skill, "Skill created successfully"));
});

const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ title: 1 });
  return res.status(200).json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

const updateSkill = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, level, experience } = req.body;

  let iconUrl;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    iconUrl = result.secure_url;
  }

  const skill = await Skill.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
        ...(level && { level }),
        ...(experience && { experience }),
        ...(iconUrl && { iconUrl }),
      },
    },
    { new: true }
  );

  if (!skill) throw new ApiError(404, "Skill not found");
  return res.status(200).json(new ApiResponse(200, skill, "Skill updated successfully"));
});

const deleteSkill = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const skill = await Skill.findByIdAndDelete(id);
  if (!skill) throw new ApiError(404, "Skill not found");

  return res.status(200).json(new ApiResponse(200, {}, "Skill deleted successfully"));
});

export { createSkill, getSkills, updateSkill, deleteSkill };