import { Router } from 'express';
import { 
  inviteSupplier, 
  getConnections, 
  updateConnectionStatus, 
  searchSuppliers 
} from '../controllers/connectionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/invite', inviteSupplier);
router.get('/', getConnections);
router.patch('/:id/status', updateConnectionStatus);
router.get('/search', searchSuppliers);

export default router;
