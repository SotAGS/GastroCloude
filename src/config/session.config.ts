import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import { sequelize } from './database.config';
import { env, isProduction } from './env.config';

const SequelizeStore = connectSessionSequelize(session.Store);

export const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'session',
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

export const sessionMiddleware = session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
  },
});