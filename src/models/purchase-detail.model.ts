import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Purchase } from './purchase.model';
import { Product } from './product.model';

@Table({ tableName: 'purchase_detail', timestamps: true })
export class PurchaseDetail extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Purchase)
  @Column({ type: DataType.UUID, allowNull: false })
  declare purchaseId: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false })
  declare productId: string;

  @Column({ type: DataType.DECIMAL(14, 3), allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  declare unitCost: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  declare lineTotal: number;

  @BelongsTo(() => Purchase)
  declare purchase: Purchase;

  @BelongsTo(() => Product)
  declare product: Product;
}