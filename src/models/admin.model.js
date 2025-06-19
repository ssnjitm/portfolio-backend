// server/models/Admin.js
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    passwordHash: {
        type: String,
        required: true,
    },
    fullName: String,
    email: String,
    phone: String,
    location: String,
    profileImage: String, // URL of profile photo
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        portfolio: String,
        youtube: String,
        facebook: String,
        instagram: String,
        upwork: String,
        freelancer: String,
        fiverr: String,
        others: String,

    },
})

// Password check method
adminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash)
}

export default mongoose.model('Admin', adminSchema)