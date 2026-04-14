import { Router } from 'express';
import { flipPOToInvoice, getInvoices, updateInvoiceStatus } from '../controllers/invoiceController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getInvoices);
router.post('/flip/:poId', flipPOToInvoice);
router.patch('/:id/status', updateInvoiceStatus);

export default router;
