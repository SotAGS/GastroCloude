import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Role, RolePermission, User } from '../models';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../utils/http-error.util';

interface UpdateUserSecurityPayload {
  roleId: string;
  isActive: boolean;
}

interface CreateUserPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  roleId: string;
  isActive: boolean;
}

interface UpdateUserPayload {
  fullName: string;
  username: string;
  email: string;
  roleId: string;
  isActive: boolean;
  password?: string;
}

interface CreateRolePayload {
  name: string;
  description?: string;
}

interface UpdateRolePayload {
  name: string;
  description?: string;
}

interface UpdateRolePermissionsPayload {
  permissions: string[];
}

const DEFAULT_PERMISSIONS = [
  'dashboard:view',
  'compras:view',
  'compras:create',
  'compras:update-status',
  'stock:view',
  'seguridad:view',
  'seguridad:manage-users',
  'seguridad:manage-roles',
  'seguridad:manage-permissions',
] as const;

export class SecurityService {
  private readonly userRepository = new UserRepository();

  // Catalogo base de permisos disponibles para asignar a roles.
  static getDefaultPermissions(): string[] {
    return [...DEFAULT_PERMISSIONS];
  }

  async securityDashboard() {
    const users = await this.listUsers();
    const roles = await this.listRoles();
    return {
      users,
      roles,
      availablePermissions: SecurityService.getDefaultPermissions(),
    };
  }

  async listUsers() {
    const users = await this.userRepository.listWithRole();
    return users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      roleId: user.roleId,
      roleName: user.role?.name ?? null,
      lastLoginAt: user.lastLoginAt,
    }));
  }

  async listRoles() {
    const roles = await Role.findAll({
      include: [{ model: RolePermission }],
      order: [['name', 'ASC']],
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: (role.permissions || [])
        .map((permission) => `${permission.module}:${permission.action}`)
        .sort((a, b) => a.localeCompare(b)),
    }));
  }

  async createUser(payload: CreateUserPayload): Promise<void> {
    await this.ensureUniqueUserFields(payload.username, payload.email);

    const role = await Role.findByPk(payload.roleId);
    if (!role) {
      throw new HttpError(400, 'Rol invalido.');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    await User.create({
      fullName: payload.fullName,
      username: payload.username,
      email: payload.email,
      passwordHash,
      roleId: payload.roleId,
      isActive: payload.isActive,
    });
  }

  async updateUser(userId: string, payload: UpdateUserPayload): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, 'Usuario no encontrado.');
    }

    await this.ensureUniqueUserFields(payload.username, payload.email, user.id);

    const role = await Role.findByPk(payload.roleId);
    if (!role) {
      throw new HttpError(400, 'Rol invalido.');
    }

    await this.guardLastAdminRule(user.id, user.role?.name ?? null, role.name, payload.isActive);

    const updateValues: Partial<User> & { passwordHash?: string } = {
      fullName: payload.fullName,
      username: payload.username,
      email: payload.email,
      roleId: payload.roleId,
      isActive: payload.isActive,
    };

    if (payload.password && payload.password.trim()) {
      updateValues.passwordHash = await bcrypt.hash(payload.password, 10);
    }

    await User.update(updateValues, { where: { id: user.id } });
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, 'Usuario no encontrado.');
    }

    await this.guardLastAdminRule(user.id, user.role?.name ?? null, null, false);
    await user.destroy();
  }

  async updateUserSecurity(userId: string, payload: UpdateUserSecurityPayload): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, 'Usuario no encontrado.');
    }

    const role = await Role.findByPk(payload.roleId);
    if (!role) {
      throw new HttpError(400, 'Rol invalido.');
    }

    await this.guardLastAdminRule(user.id, user.role?.name ?? null, role.name, payload.isActive);
    await this.userRepository.updateSecurityProfile(user.id, role.id, payload.isActive);
  }

  async createRole(payload: CreateRolePayload): Promise<void> {
    const roleName = payload.name.trim().toUpperCase();

    const existing = await Role.findOne({ where: { name: roleName } });
    if (existing) {
      throw new HttpError(400, 'El rol ya existe.');
    }

    await Role.create({
      name: roleName,
      description: payload.description?.trim() || null,
    });
  }

  async updateRole(roleId: string, payload: UpdateRolePayload): Promise<void> {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new HttpError(404, 'Rol no encontrado.');
    }

    const roleName = payload.name.trim().toUpperCase();
    const duplicate = await Role.findOne({
      where: {
        name: roleName,
        id: { [Op.ne]: role.id },
      },
    });

    if (duplicate) {
      throw new HttpError(400, 'Ya existe otro rol con ese nombre.');
    }

    role.name = roleName;
    role.description = payload.description?.trim() || null;
    await role.save();
  }

  async deleteRole(roleId: string): Promise<void> {
    const role = await Role.findByPk(roleId, { include: [User] });
    if (!role) {
      throw new HttpError(404, 'Rol no encontrado.');
    }

    if ((role.users || []).length > 0) {
      throw new HttpError(400, 'No se puede eliminar un rol con usuarios asociados.');
    }

    await RolePermission.destroy({ where: { roleId: role.id } });
    await role.destroy();
  }

  async updateRolePermissions(roleId: string, payload: UpdateRolePermissionsPayload): Promise<void> {
    // Reemplaza en bloque los permisos del rol, validando que todos pertenezcan al catalogo permitido.
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new HttpError(404, 'Rol no encontrado.');
    }

    const permissions = Array.from(new Set(payload.permissions.map((permission) => permission.trim()).filter(Boolean)));

    for (const permission of permissions) {
      if (!DEFAULT_PERMISSIONS.includes(permission as (typeof DEFAULT_PERMISSIONS)[number])) {
        throw new HttpError(400, `Permiso invalido: ${permission}`);
      }
    }

    await RolePermission.destroy({ where: { roleId: role.id } });

    if (permissions.length === 0) {
      return;
    }

    await RolePermission.bulkCreate(
      permissions.map((permission) => {
        const [module, action] = permission.split(':');
        return {
          roleId: role.id,
          module,
          action,
        };
      }),
    );
  }

  async roleHasPermission(roleName: string, permission: string): Promise<boolean> {
    if (roleName === 'ADMIN') {
      return true;
    }

    const [module, action] = permission.split(':');
    if (!module || !action) {
      return false;
    }

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return false;
    }

    const count = await RolePermission.count({
      where: {
        roleId: role.id,
        module,
        action,
      },
    });

    return count > 0;
  }

  private async ensureUniqueUserFields(username: string, email: string, excludeUserId?: string): Promise<void> {
    // Impide duplicados de username/email al crear o editar usuarios.
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const conditions = [{ username: normalizedUsername }, { email: normalizedEmail }];

    const where = excludeUserId
      ? {
          [Op.and]: [{ id: { [Op.ne]: excludeUserId } }, { [Op.or]: conditions }],
        }
      : {
          [Op.or]: conditions,
        };

    const existing = await User.findOne({ where });
    if (!existing) {
      return;
    }

    if (existing.username === normalizedUsername) {
      throw new HttpError(400, 'El nombre de usuario ya esta en uso.');
    }

    throw new HttpError(400, 'El email ya esta en uso.');
  }

  private async guardLastAdminRule(
    userId: string,
    currentRoleName: string | null,
    nextRoleName: string | null,
    nextIsActive: boolean,
  ): Promise<void> {
    // Regla de seguridad: nunca dejar el sistema sin al menos un ADMIN activo.
    if (currentRoleName !== 'ADMIN') {
      return;
    }

    const adminUsers = await User.findAll({
      include: [{ model: Role, where: { name: 'ADMIN' }, required: true }],
      paranoid: true,
    });

    const activeAdmins = adminUsers.filter((admin) => admin.isActive);
    const isTargetAdmin = adminUsers.some((admin) => admin.id === userId);

    if (!isTargetAdmin) {
      return;
    }

    const adminWillRemainAdmin = nextRoleName === 'ADMIN';
    const adminWillRemainActive = nextIsActive;

    if (activeAdmins.length <= 1 && (!adminWillRemainAdmin || !adminWillRemainActive)) {
      throw new HttpError(400, 'Debe existir al menos un ADMIN activo en el sistema.');
    }
  }
}
