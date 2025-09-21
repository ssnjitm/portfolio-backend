// server/utils/uploadToCloudinary.js
import streamifier from 'streamifier'
import cloudinary from '../config/cloudinary.config.js'

const uploadToCloudinary = (fileBuffer, folderName = "portfolio") => {
  if (!fileBuffer) {
    return Promise.reject(new Error("File buffer is missing"));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
export default uploadToCloudinary