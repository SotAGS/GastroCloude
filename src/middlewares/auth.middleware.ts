import { NextFunction, Request, Response } from 'express';

// Protege rutas privadas; si no hay sesion redirige al login.
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }

  req.user = req.session.user;
  next();
};