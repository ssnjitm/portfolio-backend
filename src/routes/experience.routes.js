import express from 'express';
import {
    createExperience,
    deleteExperience,
    getExperience,
    getExperiences,
    updateExperience
} from '../controllers/experience.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Public routes (no authentication needed)
router.get('/', getExperiences);
router.get('/:id', getExperience);

// Protected routes (require JWT authentication)
router.post('/',  upload.single('jobThumbnail'), createExperience); //verifyJWT,
router.patch('/:id', verifyJWT, upload.single('jobThumbnail'), updateExperience);
router.delete('/:id', verifyJWT, deleteExperience);
 
export default router;