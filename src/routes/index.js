import express from 'express';
import { changePassword } from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { ApiError } from '../utils/ApiError.js';
import adminRouter from './admin.routes.js';
import contactRouter from './contact.routes.js';
import experienceRouter from './experience.routes.js';
import projectRouter from './project.routes.js';
import skillRouter from './skill.routes.js';
import webcontentRouter from './webcontent.routes.js';
import contactMessageRoutes from './contactMessage.routes.js';

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/experiences', experienceRouter);
router.use('/projects', projectRouter);
router.use('/skills', skillRouter);
router.use('/contact', contactRouter);
router.patch('/change-password', verifyJWT, changePassword);
router.use('/webcontent', webcontentRouter);
router.use('/contact-messages', contactMessageRoutes);



// 404 for undefined routes
router.use((req, res, next) => {
    next(new ApiError(404, 'Route not found'));
});

export default router;