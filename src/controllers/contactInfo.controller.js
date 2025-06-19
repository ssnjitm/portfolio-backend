import ContactInfo from '../models/contactInfo.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get contact info
const getContactInfo = asyncHandler(async(req, res) => {
    const contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
        // Return default empty structure if no contact info exists
        return res.status(200).json(
            new ApiResponse(200, {
                email: '',
                phone: '',
                location: '',
                socialLinks: {
                    github: '',
                    linkedin: '',
                    twitter: ''
                }
            }, "Contact info fetched successfully")
        );
    }

    return res.status(200)
        .json(new ApiResponse(200, contactInfo, "Contact info fetched successfully"));
});

// Update contact info
const updateContactInfo = asyncHandler(async(req, res) => {
    const { email, phone, location, socialLinks } = req.body;

    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
        // Create new contact info if it doesn't exist
        contactInfo = await ContactInfo.create({
            email,
            phone,
            location,
            socialLinks: socialLinks ? JSON.parse(socialLinks) : {
                github: '',
                linkedin: '',
                twitter: ''
            }
        });
    } else {
        // Update existing contact info
        contactInfo = await ContactInfo.findOneAndUpdate({}, {
            $set: {
                email,
                phone,
                location,
                socialLinks: socialLinks ? JSON.parse(socialLinks) : contactInfo.socialLinks
            }
        }, { new: true });
    }

    return res.status(200)
        .json(new ApiResponse(200, contactInfo, "Contact info updated successfully"));
});

export {
    getContactInfo,
    updateContactInfo
};