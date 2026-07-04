import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

const router = Router();
const stockController = new StockController();

router.get('/', requireAuth, requirePermission('stock:view'), (req, res, next) => stockController.list(req, res, next));

export default router;