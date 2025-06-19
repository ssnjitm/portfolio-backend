// server/utils/uploadToCloudinary.js
import streamifier from 'streamifier'
import cloudinary from '../config/cloudinary.config.js'

const uploadToCloudinary = (fileBuffer, folderName = 'portfolio') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: folderName },
            (error, result) => {
                if (result) {
                    resolve(result)
                } else {
                    reject(error)
                }
            }
        )

        streamifier.createReadStream(fileBuffer).pipe(stream)
    })
}

export default uploadToCloudinary