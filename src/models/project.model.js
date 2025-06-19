// server/models/Project.js
import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: String, // Optional image
    githubLink: {
        type: String,
        required: true,
    },
    liveLink: String,
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)