import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { loginValidator } from '../validators/auth.validator';
import { handleValidation } from '../middlewares/validation.middleware';

const router = Router();
const authController = new AuthController();

router.get('/login', (req, res) => authController.showLogin(req, res));
router.post('/login', loginValidator, handleValidation, (req: Request, res: Response, next: NextFunction) =>
	authController.login(req, res, next),
);
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;