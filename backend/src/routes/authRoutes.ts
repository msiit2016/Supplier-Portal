import { Router } from 'express';
import { registerTenant, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', registerTenant);
router.get('/me', authMiddleware, getMe);

export default router;
