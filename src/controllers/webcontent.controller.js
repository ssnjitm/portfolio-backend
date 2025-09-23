// controllers/webcontent.controller.js
import WebContent from "../models/webcontent.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadToCloudinary from "../utils/cloudinary.js";

// 👉 GET controller
export const getWebContent = asyncHandler(async (req, res) => {
  const webContent = await WebContent.findOne();
  if (!webContent) {
    return res.status(200).json(
      new ApiResponse(200, {
        heroTitle: "",
        heroDescription: "",
        downloadCVLink: "",
        aboutMeImage: "",
        aboutMeDescription1: "",
        aboutMeDescription2: "",
      })
    );
  }
  return res.status(200).json(new ApiResponse(200, webContent));
});

// 👉 UPSERT controller
export const upsertWebContent = asyncHandler(async (req, res) => {
  const { heroTitle, heroDescription, aboutMeDescription1, aboutMeDescription2 } = req.body;

  let aboutMeImageUrl = "";
  let cvUrl = "";

  // ✅ IMAGE upload (use resource_type: "image")
  if (req.files?.aboutMeImage) {
    console.log("Uploading AboutMe image...");
    const result = await uploadToCloudinary(
      req.files.aboutMeImage[0].buffer,
      "webContent",
      "image"   // correct type for jpg/png
    );
    aboutMeImageUrl = result.secure_url;
  }

  // ✅ CV PDF upload (use resource_type: "raw")
if (req.files?.downloadCV) {
  const result = await uploadToCloudinary(
    req.files.downloadCV[0].buffer,
    "webContent",
    "raw",
    "SanjeetCV",  // public_id
    "pdf"         // 👈 enforce .pdf format
  );
  console.log("CV Upload result:", result);
  cvUrl = result.secure_url;
}

  let webContent = await WebContent.findOne();

  if (!webContent) {
    // 👉 CREATE new record
    if (!aboutMeImageUrl || !cvUrl) {
      throw new ApiError(400, "Both About Me image and CV PDF are required when creating new content.");
    }

    webContent = await WebContent.create({
      heroTitle,
      heroDescription,
      downloadCVLink: cvUrl,
      aboutMeImage: aboutMeImageUrl,
      aboutMeDescription1,
      aboutMeDescription2,
    });
  } else {
    // 👉 UPDATE existing record
    webContent = await WebContent.findOneAndUpdate(
      {},
      {
        $set: {
          heroTitle,
          heroDescription,
          aboutMeDescription1,
          aboutMeDescription2,
          ...(aboutMeImageUrl && { aboutMeImage: aboutMeImageUrl }),
          ...(cvUrl && { downloadCVLink: cvUrl }),
        },
      },
      { new: true }
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, webContent, "Web content upserted successfully"));
});