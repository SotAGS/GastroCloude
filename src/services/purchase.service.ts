import { Transaction } from 'sequelize';
import { sequelize } from '../config/database.config';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { CreatePurchaseDto } from '../interfaces/dto.interface';
import { ProductRepository } from '../repositories/product.repository';
import { PurchaseRepository } from '../repositories/purchase.repository';
import { SupplierRepository } from '../repositories/supplier.repository';
import { HttpError } from '../utils/http-error.util';
import { generatePurchaseNumber } from '../utils/string.util';
import { StockService } from './stock.service';

export class PurchaseService {
  private readonly supplierRepository = new SupplierRepository();
  private readonly productRepository = new ProductRepository();
  private readonly purchaseRepository = new PurchaseRepository();
  private readonly stockService = new StockService();

  async listPurchases() {
    return this.purchaseRepository.listAll();
  }

  async getById(id: string) {
    const purchase = await this.purchaseRepository.findByIdWithDetails(id);
    if (!purchase) {
      throw new HttpError(404, 'Compra no encontrada');
    }
    return purchase;
  }

  async createPurchase(payload: CreatePurchaseDto, actorUserId: string) {
    await this.validateCreatePayload(payload);

    const subtotal = payload.details.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

    return sequelize.transaction(async (transaction) => {
      const purchase = await this.purchaseRepository.createWithDetails(
        payload,
        actorUserId,
        generatePurchaseNumber(),
        Number(subtotal.toFixed(2)),
        transaction,
      );

      const completePurchase = await this.purchaseRepository.findByIdWithDetails(purchase.id, transaction);
      if (!completePurchase) {
        throw new HttpError(500, 'No fue posible recuperar la compra creada');
      }
      return completePurchase;
    });
  }

  async changeStatus(purchaseId: string, status: PurchaseStatus, actorUserId: string) {
    return sequelize.transaction(async (transaction: Transaction) => {
      const purchase = await this.purchaseRepository.findByIdWithDetails(purchaseId, transaction);
      if (!purchase) {
        throw new HttpError(404, 'Compra no encontrada');
      }

      this.validateStatusTransition(purchase.status, status);

      if (status === PurchaseStatus.RECIBIDA) {
        if (!purchase.details || purchase.details.length === 0) {
          throw new HttpError(409, 'No se puede recibir una compra sin detalles');
        }

        await this.stockService.increaseFromPurchase(purchase.id, purchase.details, actorUserId, transaction);
      }

      await this.purchaseRepository.updateStatus(purchase.id, status, transaction);
      const updated = await this.purchaseRepository.findByIdWithDetails(purchase.id, transaction);

      if (!updated) {
        throw new HttpError(500, 'No fue posible recuperar la compra actualizada');
      }

      return updated;
    });
  }

  private validateStatusTransition(current: PurchaseStatus, next: PurchaseStatus): void {
    if (current === next) {
      throw new HttpError(409, 'La compra ya se encuentra en ese estado');
    }

    const allowedTransitions: Record<PurchaseStatus, PurchaseStatus[]> = {
      [PurchaseStatus.PENDIENTE]: [PurchaseStatus.RECIBIDA, PurchaseStatus.CANCELADA],
      [PurchaseStatus.RECIBIDA]: [],
      [PurchaseStatus.CANCELADA]: [],
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new HttpError(409, 'Transicion de estado invalida');
    }
  }

  private async validateCreatePayload(payload: CreatePurchaseDto): Promise<void> {
    const supplier = await this.supplierRepository.findActiveById(payload.supplierId);
    if (!supplier) {
      throw new HttpError(404, 'Proveedor inexistente o inactivo');
    }

    if (!payload.details || payload.details.length === 0) {
      throw new HttpError(400, 'La compra debe incluir al menos un detalle');
    }

    const hasInvalidDetail = payload.details.some((item) => item.quantity <= 0 || item.unitCost < 0);
    if (hasInvalidDetail) {
      throw new HttpError(400, 'Hay lineas de detalle con valores invalidos');
    }

    const productIds = [...new Set(payload.details.map((item) => item.productId))];
    const count = await this.productRepository.countActiveByIds(productIds);
    if (count !== productIds.length) {
      throw new HttpError(404, 'Uno o mas productos no existen o estan inactivos');
    }
  }
}