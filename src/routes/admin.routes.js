import express from 'express';
import {
    getAdminProfile,
    loginAdmin,
    logoutAdmin,
    registerAdmin,
    updateAdminProfile
} from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Unprotected routes
router.post('/register', upload.single('profileImage'), registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (require JWT authentication)
router.post('/logout', verifyJWT, logoutAdmin);
router.get('/profile', verifyJWT, getAdminProfile);
router.patch('/profile', verifyJWT,  updateAdminProfile);

export default router;