import { Router } from 'express';
import { createProduct, getProducts, updateProduct } from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createProduct);
router.get('/', getProducts);
router.patch('/:id', updateProduct);

export default router;
