import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { HttpError } from '../utils/http-error.util';

export class AuthController {
  private readonly authService = new AuthService();

  showLogin(req: Request, res: Response): void {
    if (req.session.user) {
      res.redirect('/dashboard');
      return;
    }
    res.render('auth/login', {
      error: null,
      usernameOrEmail: '',
      demoAccounts: res.locals.demoAccounts ?? null,
    });
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.authService.login(req.body);
      req.session.user = user;

      req.session.save((saveError) => {
        if (saveError) {
          console.error('Error al guardar sesion en login:', saveError);
          next(saveError);
          return;
        }
        res.redirect('/dashboard');
      });
    } catch (error) {
      if (error instanceof HttpError && [401, 403].includes(error.statusCode)) {
        res.status(error.statusCode).render('auth/login', {
          error: error.message,
          usernameOrEmail: req.body.usernameOrEmail ?? '',
          demoAccounts: res.locals.demoAccounts ?? null,
        });
        return;
      }
      console.error('Error durante login:', error);
      next(error);
    }
  }

  logout(req: Request, res: Response): void {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  }
}