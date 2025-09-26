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
    techstack:String,
    imageUrl: String, // Optional image
    githubLink: {
        type: String,
        required: true,
    },
    liveLink: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)