import { Product } from '../models';
import { Op } from 'sequelize';

export class ProductRepository {
  async countActiveByIds(ids: string[]): Promise<number> {
    return Product.count({ where: { id: { [Op.in]: ids }, isActive: true } });
  }
}