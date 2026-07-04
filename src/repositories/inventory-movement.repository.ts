import { Transaction } from 'sequelize';
import { InventoryMovement, Product } from '../models';

interface CreateMovementInput {
  productId: string;
  stockId: string;
  createdByUserId: string;
  movementType: string;
  originType: string;
  originId: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  notes?: string;
}

export class InventoryMovementRepository {
  async create(input: CreateMovementInput, transaction: Transaction): Promise<void> {
    await InventoryMovement.create(
      {
        ...input,
        movementDate: new Date(),
        notes: input.notes ?? null,
      },
      { transaction },
    );
  }

  async listRecent(limit = 50): Promise<InventoryMovement[]> {
    return InventoryMovement.findAll({
      include: [{ model: Product }],
      order: [['movementDate', 'DESC']],
      limit,
    });
  }
}