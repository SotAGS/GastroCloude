import bcrypt from 'bcrypt';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { RolePermission } from '../models/role-permission.model';
import { UserRole } from '../enums/user-role.enum';
import { env, isProduction } from '../config/env.config';

interface DemoAccount {
  role: UserRole;
  username: string;
  password: string;
}

const demoAccounts: DemoAccount[] = [
  {
    role: UserRole.ADMIN,
    username: env.demoAdminUsername,
    password: env.demoAdminPassword,
  },
  {
    role: UserRole.EMPLEADO,
    username: env.demoEmployeeUsername,
    password: env.demoEmployeePassword,
  },
];

export class BootstrapSecurityService {
  private static readonly defaultPermissionsByRole: Record<string, string[]> = {
    ADMIN: [
      'dashboard:view',
      'compras:view',
      'compras:create',
      'compras:update-status',
      'stock:view',
      'seguridad:view',
      'seguridad:manage-users',
      'seguridad:manage-roles',
      'seguridad:manage-permissions',
    ],
    EMPLEADO: ['dashboard:view', 'compras:view', 'stock:view'],
  };

  static getDemoAccounts(): DemoAccount[] {
    return isProduction ? [] : demoAccounts;
  }

  private static async ensureRolePermissions(role: Role): Promise<void> {
    const expected = this.defaultPermissionsByRole[role.name] ?? [];
    if (expected.length === 0) {
      return;
    }

    const existing = await RolePermission.findAll({ where: { roleId: role.id } });
    if (existing.length > 0) {
      return;
    }

    await RolePermission.bulkCreate(
      expected.map((permission) => {
        const [module, action] = permission.split(':');
        return {
          roleId: role.id,
          module,
          action,
        };
      }),
    );
  }

  static async ensureBaseSecurityData(): Promise<void> {
    const [adminRole] = await Role.findOrCreate({
      where: { name: UserRole.ADMIN },
      defaults: {
        description: 'Administrador con control total del sistema.',
      },
    });

    const [employeeRole] = await Role.findOrCreate({
      where: { name: UserRole.EMPLEADO },
      defaults: {
        description: 'Usuario operativo con acceso limitado.',
      },
    });

    await this.ensureRolePermissions(adminRole);
    await this.ensureRolePermissions(employeeRole);

    const totalUsers = await User.count();
    if (totalUsers > 0 || isProduction) {
      const employeeUser = await User.findOne({ where: { username: env.demoEmployeeUsername } });
      if (employeeUser) {
        employeeUser.passwordHash = await bcrypt.hash(env.demoEmployeePassword, 10);
        employeeUser.isActive = true;
        await employeeUser.save();
      }
      return;
    }

    const adminHash = await bcrypt.hash(env.demoAdminPassword, 10);
    const employeeHash = await bcrypt.hash(env.demoEmployeePassword, 10);

    await User.create({
      roleId: adminRole.id,
      fullName: 'Administrador Demo',
      username: env.demoAdminUsername,
      email: env.demoAdminEmail,
      passwordHash: adminHash,
      isActive: true,
    });

    await User.create({
      roleId: employeeRole.id,
      fullName: 'Empleado Demo',
      username: env.demoEmployeeUsername,
      email: env.demoEmployeeEmail,
      passwordHash: employeeHash,
      isActive: true,
    });

    console.log('Usuarios demo creados:');
    for (const account of demoAccounts) {
      console.log(`- ${account.role}: ${account.username} / ${account.password}`);
    }
  }
}
