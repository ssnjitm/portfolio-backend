// controllers/contactMessageController.js
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ContactMessage from '../models/contactMessage.model.js';

// @desc    Submit a new contact message
// @route   POST /api/v1/contact-messages
// @access  Public
export const submitMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Validate required fields
  if (!name?.trim()) {
    throw new ApiError(400, "Name is required");
  }
  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }
  if (!message?.trim()) {
    throw new ApiError(400, "Message is required");
  }

  // Optional: Basic email regex validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Create and save message
  const newMessage = await ContactMessage.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    message: message.trim(),
  });

  // Return success response
  res.status(201).json({
    success: true,
    message: "Message submitted successfully",
    data: newMessage,
  });
});

// @desc    Get all contact messages (admin)
// @route   GET /api/v1/contact-messages/admin
// @access  Private (add auth later if needed)
export const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Messages fetched successfully",
    count: messages.length,
    data: messages,
  });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await ContactMessage.findById(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  await ContactMessage.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});