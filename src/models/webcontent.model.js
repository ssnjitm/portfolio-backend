import mongoose from 'mongoose';

const webContentSchema = new mongoose.Schema({
    heroTitle:{ type: String, required: true },
    heroDescription:{ type: String, required: true },
    downloadCVLink:{ type: String, required: true },
    aboutMeImage:{ type: String, required: true },
    aboutMeDescription1:{ type: String, required: true },
    aboutMeDescription2:{ type: String, required: false },

    
},{ timestamps: true});

const WebContent = mongoose.model('WebContent', webContentSchema);

export default WebContent;