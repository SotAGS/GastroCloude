import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../enums/user-role.enum';

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.session.user?.role as UserRole | undefined;
    if (!role || !roles.includes(role)) {
      res.status(403).render('partials/error-page', {
        user: req.session.user ?? null,
        message: 'No tienes permisos para ejecutar esta accion.',
        details: [],
      });
      return;
    }
    next();
  };
};