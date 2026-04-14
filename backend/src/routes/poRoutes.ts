import { Router } from 'express';
import { createPO, getPOs, updatePOStatus } from '../controllers/poController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createPO);
router.get('/', getPOs);
router.patch('/:id/status', updatePOStatus);

export default router;
