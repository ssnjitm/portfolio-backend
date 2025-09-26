// routes/contactMessageRoutes.js
import express from 'express';
import {
  submitMessage,
  getAllMessages,
  deleteMessage,
} from '../controllers/contactMessage.controller.js';

const router = express.Router();

router.route('/').post(submitMessage);
router.route('/admin').get(getAllMessages);
router.route('/:id').delete(deleteMessage);

export default router;