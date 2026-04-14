import { Router } from 'express';
import { 
  inviteSupplier, 
  getConnections, 
  updateConnectionStatus, 
  searchSuppliers 
} from '../controllers/connectionController';
import { authMiddleware } from '../middleware/auth';
import { checkSupplierLimit } from '../middleware/limitMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/invite', checkSupplierLimit, inviteSupplier);
router.get('/', getConnections);
router.patch('/:id/status', updateConnectionStatus);
router.get('/search', searchSuppliers);

export default router;
