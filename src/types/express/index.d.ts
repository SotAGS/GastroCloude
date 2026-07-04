import { AuthUser } from '../../interfaces/auth-user.interface';

declare module 'express-session' {
  interface SessionData {
    user?: AuthUser;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};