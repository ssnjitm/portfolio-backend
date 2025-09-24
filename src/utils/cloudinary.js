// server/utils/uploadToCloudinary.js
import streamifier from 'streamifier'
import cloudinary from '../config/cloudinary.config.js'


const uploadToCloudinary = (
  fileBuffer,
  folderName = "portfolio",
  resourceType = "auto",
  fileName = null,
  format = null
) => {
  if (!fileBuffer) {
    return Promise.reject(new Error("File buffer is missing"));
  }

  return new Promise((resolve, reject) => {
    const options = {
      folder: folderName,
      resource_type: resourceType,
    };

    // If filename suggests it's a document (pdf/docx), force raw
    if (fileName && fileName.match(/\.(pdf|docx?|pptx?|xlsx?|zip)$/i)) {
      options.resource_type = "raw";
    }

    if (fileName) options.public_id = fileName.replace(/\.[^/.]+$/, "");
    if (format) options.format = format;

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default uploadToCloudinary;