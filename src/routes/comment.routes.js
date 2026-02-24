import { Router } from 'express';
import { createComment, updateComment, deleteComment } from '../controllers/comment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/:postId', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;