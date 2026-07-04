import { Transaction } from 'sequelize';
import { InventoryMovementType, InventoryOriginType } from '../enums/inventory-movement.enum';
import { PurchaseDetail } from '../models';
import { StockRepository } from '../repositories/stock.repository';
import { InventoryMovementRepository } from '../repositories/inventory-movement.repository';

export class StockService {
  private readonly stockRepository = new StockRepository();
  private readonly inventoryMovementRepository = new InventoryMovementRepository();

  async increaseFromPurchase(
    purchaseId: string,
    details: PurchaseDetail[],
    actorUserId: string,
    transaction: Transaction,
  ): Promise<void> {
    for (const detail of details) {
      let stock = await this.stockRepository.findByProductId(detail.productId, transaction);
      if (!stock) {
        stock = await this.stockRepository.createInitial(detail.productId, transaction);
      }

      const previousQuantity = Number(stock.currentQuantity);
      const newQuantity = Number((previousQuantity + Number(detail.quantity)).toFixed(3));

      stock.currentQuantity = newQuantity;
      stock.lastMovementAt = new Date();
      await this.stockRepository.save(stock, transaction);

      await this.inventoryMovementRepository.create(
        {
          productId: detail.productId,
          stockId: stock.id,
          createdByUserId: actorUserId,
          movementType: InventoryMovementType.ENTRADA,
          originType: InventoryOriginType.COMPRA,
          originId: purchaseId,
          quantity: Number(detail.quantity),
          previousQuantity,
          newQuantity,
          notes: 'Ingreso por compra recibida',
        },
        transaction,
      );
    }
  }

  async listCurrentStock() {
    return this.stockRepository.listAll();
  }
}