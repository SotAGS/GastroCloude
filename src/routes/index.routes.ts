import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import purchaseRoutes from './purchase.routes';
import stockRoutes from './stock.routes';
import securityRoutes from './security.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.redirect('/dashboard');
});

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/compras', purchaseRoutes);
router.use('/stock', stockRoutes);
router.use('/seguridad', securityRoutes);

export default router;