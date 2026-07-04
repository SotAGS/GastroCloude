import { User } from '../models';
import { Op } from 'sequelize';
import { UserRole } from '../enums/user-role.enum';

export class UserRepository {
  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
      include: [
        {
          association: 'role',
          include: ['permissions'],
        },
      ],
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await User.update({ lastLoginAt: new Date() }, { where: { id: userId } });
  }

  async listWithRole(): Promise<User[]> {
    return User.findAll({
      include: ['role'],
      order: [['fullName', 'ASC']],
    });
  }

  async findById(userId: string): Promise<User | null> {
    return User.findByPk(userId, { include: ['role'] });
  }

  async countAdmins(): Promise<number> {
    return User.count({
      include: [
        {
          association: 'role',
          where: { name: UserRole.ADMIN },
          required: true,
        },
      ],
    });
  }

  async updateSecurityProfile(userId: string, roleId: string, isActive: boolean): Promise<void> {
    await User.update({ roleId, isActive }, { where: { id: userId } });
  }
}