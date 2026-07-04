import bcrypt from 'bcrypt';
import { LoginDto } from '../interfaces/dto.interface';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../utils/http-error.util';
import { AuthUser } from '../interfaces/auth-user.interface';

export class AuthService {
  private readonly userRepository = new UserRepository();

  async login(payload: LoginDto): Promise<AuthUser> {
    const user = await this.userRepository.findByUsernameOrEmail(payload.usernameOrEmail);
    if (!user) {
      throw new HttpError(401, 'Credenciales invalidas');
    }

    if (!user.isActive) {
      throw new HttpError(403, 'El usuario esta inactivo');
    }

    const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValidPassword) {
      throw new HttpError(401, 'Credenciales invalidas');
    }

    await this.userRepository.updateLastLogin(user.id);

    const permissions = (user.role?.permissions || []).map(
      (permission) => `${permission.module}:${permission.action}`,
    );

    return {
      id: user.id,
      fullName: user.fullName,
      role: user.role?.name ?? 'EMPLEADO',
      permissions,
    };
  }
}