import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './product.model';
import { Stock } from './stock.model';
import { User } from './user.model';
import { InventoryMovementType, InventoryOriginType } from '../enums/inventory-movement.enum';

@Table({ tableName: 'inventory_movement', timestamps: true })
export class InventoryMovement extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false })
  declare productId: string;

  @ForeignKey(() => Stock)
  @Column({ type: DataType.UUID, allowNull: false })
  declare stockId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare createdByUserId: string;

  @Column({ type: DataType.ENUM(...Object.values(InventoryMovementType)), allowNull: false })
  declare movementType: InventoryMovementType;

  @Column({ type: DataType.ENUM(...Object.values(InventoryOriginType)), allowNull: false })
  declare originType: InventoryOriginType;

  @Column({ type: DataType.UUID, allowNull: false })
  declare originId: string;

  @Column({ type: DataType.DECIMAL(14, 3), allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(14, 3), allowNull: false })
  declare previousQuantity: number;

  @Column({ type: DataType.DECIMAL(14, 3), allowNull: false })
  declare newQuantity: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare movementDate: Date;

  @Column({ type: DataType.STRING(250), allowNull: true })
  declare notes: string | null;

  @BelongsTo(() => Product)
  declare product: Product;

  @BelongsTo(() => Stock)
  declare stock: Stock;

  @BelongsTo(() => User)
  declare createdBy: User;
}