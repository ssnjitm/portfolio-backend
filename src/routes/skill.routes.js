import express from 'express';
import {
    createSkill,
    deleteSkill,
    getSkills,
    getSkillsByCategory,
    updateSkill
} from '../controllers/skill.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getSkills);
router.get('/category/:category', getSkillsByCategory);

// Protected routes
router.post('/', verifyJWT, upload.single('imageUrl'), createSkill);
router.patch('/:id', verifyJWT, upload.single('imageUrl'), updateSkill);
router.delete('/:id', verifyJWT, deleteSkill);

export default router;