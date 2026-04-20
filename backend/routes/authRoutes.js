import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getUserProfile } from '../controllers/mainController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);

export default router;
