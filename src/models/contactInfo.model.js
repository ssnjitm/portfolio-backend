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
    facebook: String,
    instagram: String,
    upwork: String, // Add more as needed
    fiverr: String,
    viber:String,
    whatsapp:String,

    // Add more as needed
  },
})

export default mongoose.model('ContactInfo', contactSchema)
