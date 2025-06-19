import express from 'express';
import {
    getContactInfo,
    updateContactInfo
} from '../controllers/contactInfo.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/', getContactInfo);

// Protected route
router.patch('/', verifyJWT, updateContactInfo);

export default router;