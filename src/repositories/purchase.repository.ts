import { Includeable, Transaction } from 'sequelize';
import { Purchase, PurchaseDetail, Product, Supplier, User } from '../models';
import { CreatePurchaseDto } from '../interfaces/dto.interface';
import { PurchaseStatus } from '../enums/purchase-status.enum';

const purchaseIncludes: Includeable[] = [
  { model: Supplier },
  { model: User, as: 'createdBy' },
  {
    model: PurchaseDetail,
    as: 'details',
    include: [{ model: Product }],
  },
];

export class PurchaseRepository {
  async listAll(): Promise<Purchase[]> {
    return Purchase.findAll({ include: purchaseIncludes, order: [['createdAt', 'DESC']] });
  }

  async findByIdWithDetails(id: string, transaction?: Transaction): Promise<Purchase | null> {
    return Purchase.findByPk(id, { include: purchaseIncludes, transaction });
  }

  async createWithDetails(
    payload: CreatePurchaseDto,
    actorUserId: string,
    purchaseNumber: string,
    subtotal: number,
    transaction: Transaction,
  ): Promise<Purchase> {
    const purchase = await Purchase.create(
      {
        supplierId: payload.supplierId,
        createdByUserId: actorUserId,
        purchaseDate: payload.purchaseDate,
        observations: payload.observations ?? null,
        purchaseNumber,
        status: PurchaseStatus.PENDIENTE,
        subtotal,
        total: subtotal,
      },
      { transaction },
    );

    await PurchaseDetail.bulkCreate(
      payload.details.map((detail) => ({
        purchaseId: purchase.id,
        productId: detail.productId,
        quantity: detail.quantity,
        unitCost: detail.unitCost,
        lineTotal: Number((detail.quantity * detail.unitCost).toFixed(2)),
      })),
      { transaction },
    );

    return purchase;
  }

  async updateStatus(id: string, status: PurchaseStatus, transaction: Transaction): Promise<void> {
    await Purchase.update(
      {
        status,
        receivedAt: status === PurchaseStatus.RECIBIDA ? new Date() : null,
      },
      { where: { id }, transaction },
    );
  }
}