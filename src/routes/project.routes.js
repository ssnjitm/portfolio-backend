import express from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject
} from '../controllers/project.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Public
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected
router.post('/',  upload.single('image'), createProject);
router.patch('/:id', verifyJWT, upload.single('image'), updateProject);
router.delete('/:id', verifyJWT, deleteProject);

export default router;