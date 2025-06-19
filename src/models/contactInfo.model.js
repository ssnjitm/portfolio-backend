// server/models/ContactInfo.js
import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  email: String,
  phone: String,
  location: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
  },
})

export default mongoose.model('ContactInfo', contactSchema)
