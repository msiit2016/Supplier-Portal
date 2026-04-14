import { Router } from 'express';
import { postComment, getComments } from '../controllers/commentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', postComment);
router.get('/:parentId', getComments);

export default router;
