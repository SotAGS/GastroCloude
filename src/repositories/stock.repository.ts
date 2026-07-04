import { Transaction } from 'sequelize';
import { Stock } from '../models';

export class StockRepository {
  async findByProductId(productId: string, transaction: Transaction): Promise<Stock | null> {
    return Stock.findOne({ where: { productId }, transaction });
  }

  async createInitial(productId: string, transaction: Transaction): Promise<Stock> {
    return Stock.create(
      {
        productId,
        currentQuantity: 0,
        minimumQuantity: 0,
        maximumQuantity: null,
      },
      { transaction },
    );
  }

  async save(stock: Stock, transaction: Transaction): Promise<void> {
    await stock.save({ transaction });
  }

  async listAll(): Promise<Stock[]> {
    return Stock.findAll({ include: ['product'], order: [['updatedAt', 'DESC']] });
  }
}