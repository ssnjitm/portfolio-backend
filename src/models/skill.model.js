// server/models/Skill.js
import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: String, // e.g., Frontend, Backend, Tools
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  imageUrl: String, // ✅ NEW: icon or logo image (URL)
})

export default mongoose.model('Skill', skillSchema)
