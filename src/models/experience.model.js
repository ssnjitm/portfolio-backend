// server/models/Experience.js
import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({

    jobThumbnail: {
        type: String,
        required: false,



    },
    role: {
        type: String,
        required: true,

    },
    companyName: String,
    description: String,
    from: Date,
    to: Date,
    current: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

export default mongoose.model('Experience', experienceSchema)