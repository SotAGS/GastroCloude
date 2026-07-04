import { NextFunction, Request, Response } from 'express';
import { SecurityService } from '../services/security.service';
import { HttpError } from '../utils/http-error.util';
import bcrypt from 'bcrypt';
import { User } from '../models';

export class SecurityController {
  private readonly securityService = new SecurityService();

  async dashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.securityService.securityDashboard();

      res.render('seguridad/usuarios', {
        user: req.session.user,
        users: data.users,
        roles: data.roles,
        availablePermissions: data.availablePermissions,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityService.createUser({
        fullName: String(req.body.fullName ?? ''),
        username: String(req.body.username ?? ''),
        email: String(req.body.email ?? ''),
        password: String(req.body.password ?? ''),
        roleId: String(req.body.roleId ?? ''),
        isActive: req.body.isActive === 'on',
      });

      res.redirect('/seguridad');
    } catch (error) {
      next(error);
    }
  }

  async updateUserSecurity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityService.updateUser(String(req.params.id), {
        fullName: String(req.body.fullName ?? ''),
        username: String(req.body.username ?? ''),
        email: String(req.body.email ?? ''),
        roleId: String(req.body.roleId ?? ''),
        isActive: req.body.isActive === 'on',
        password: req.body.password ? String(req.body.password) : undefined,
      });

      res.redirect('/seguridad');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityService.deleteUser(String(req.params.id));
      res.redirect('/seguridad');
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = String(req.params.id);
      await this.securityService.updateUserSecurity(userId, {
        roleId: String(req.body.roleId ?? ''),
        isActive: req.body.isActive === 'on',
      });
      res.redirect('/seguridad');
    } catch (error) {
      if (error instanceof HttpError) {
        const data = await this.securityService.securityDashboard();
        res.status(error.statusCode).render('seguridad/usuarios', {
          user: req.session.user,
          users: data.users,
          roles: data.roles,
          availablePermissions: data.availablePermissions,
          error: error.message,
        });
        return;
      }
      next(error);
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityService.createRole({
        name: String(req.body.name ?? ''),
        description: String(req.body.description ?? ''),
      });
      res.redirect('/seguridad');
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityService.updateRole(String(req.params.id), {
        name: String(req.body.name ?? ''),
        description: String(req.body.description ?? ''),
      });
      res.redirect('/seguridad');
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityService.deleteRole(String(req.params.id));
      res.redirect('/seguridad');
    } catch (error) {
      next(error);
    }
  }

  async updateRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawPermissions = req.body.permissions;
      const permissions = Array.isArray(rawPermissions)
        ? rawPermissions.map(String)
        : rawPermissions
        ? [String(rawPermissions)]
        : [];

      await this.securityService.updateRolePermissions(String(req.params.id), { permissions });
      res.redirect('/seguridad');
    } catch (error) {
      next(error);
    }
  }

  async resetEmployeePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findOne({ where: { username: 'empleado' } });
      if (!user) {
        throw new HttpError(404, 'Usuario empleado no encontrado.');
      }

      user.passwordHash = await bcrypt.hash('empleado123', 10);
      user.isActive = true;
      await user.save();

      res.redirect('/seguridad');
    } catch (error) {
      next(error);
    }
  }
}
