import { Router } from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/post.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.use(protect);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
export default router;