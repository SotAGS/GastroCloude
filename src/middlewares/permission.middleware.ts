import { NextFunction, Request, Response } from 'express';
import { SecurityService } from '../services/security.service';

const securityService = new SecurityService();

export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const roleName = req.session.user?.role;
    const sessionPermissions = req.session.user?.permissions || [];

    if (!roleName) {
      res.status(401).render('partials/error-page', {
        user: req.session.user ?? null,
        message: 'Sesion invalida. Inicia sesion nuevamente.',
        details: [],
      });
      return;
    }

    if (roleName === 'ADMIN') {
      next();
      return;
    }

    if (sessionPermissions.includes(permission)) {
      next();
      return;
    }

    const hasPermission = await securityService.roleHasPermission(roleName, permission);
    if (!hasPermission) {
      res.status(403).render('partials/error-page', {
        user: req.session.user ?? null,
        message: `No tienes el permiso requerido: ${permission}`,
        details: [],
      });
      return;
    }

    next();
  };
};
