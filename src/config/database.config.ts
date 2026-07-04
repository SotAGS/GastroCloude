import { Sequelize } from 'sequelize-typescript';
import { env, isProduction } from './env.config';
import { Role } from '../models/role.model';
import { RolePermission } from '../models/role-permission.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { Supplier } from '../models/supplier.model';
import { Purchase } from '../models/purchase.model';
import { PurchaseDetail } from '../models/purchase-detail.model';
import { Stock } from '../models/stock.model';
import { InventoryMovement } from '../models/inventory-movement.model';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  username: env.db.username,
  password: env.db.password,
  logging: false,
  dialectOptions: env.db.ssl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  models: [Role, RolePermission, User, Category, Product, Supplier, Purchase, PurchaseDetail, Stock, InventoryMovement],
  define: {
    underscored: true,
    paranoid: false,
    freezeTableName: true,
  },
});

export const connectDatabase = async (): Promise<void> => {
  await sequelize.authenticate();
  if (!isProduction) {
    await sequelize.sync({ alter: false });
  }
};