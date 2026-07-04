import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.get('/', requireAuth, requirePermission('dashboard:view'), (req, res) => dashboardController.index(req, res));

export default router;