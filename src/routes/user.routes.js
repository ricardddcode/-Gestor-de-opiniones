import { Router } from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/password', updatePassword);

export default router;