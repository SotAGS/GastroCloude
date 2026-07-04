import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 3000),
  sessionSecret: process.env.SESSION_SECRET ?? 'change-me-in-production',
  demoAdminUsername: process.env.DEMO_ADMIN_USERNAME ?? 'admin',
  demoAdminEmail: process.env.DEMO_ADMIN_EMAIL ?? 'admin@gastrocloud.local',
  demoAdminPassword: process.env.DEMO_ADMIN_PASSWORD ?? 'Admin123*',
  demoEmployeeUsername: process.env.DEMO_EMPLOYEE_USERNAME ?? 'empleado',
  demoEmployeeEmail: process.env.DEMO_EMPLOYEE_EMAIL ?? 'empleado@gastrocloud.local',
  demoEmployeePassword: process.env.DEMO_EMPLOYEE_PASSWORD ?? 'Empleado123*',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: toNumber(process.env.DB_PORT, 5432),
    database: process.env.DB_NAME ?? 'gastrocloud',
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    ssl: (process.env.DB_SSL ?? 'false') === 'true',
  },
};

export const isProduction = env.nodeEnv === 'production';