import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Product } from './product.model';
import { InventoryMovement } from './inventory-movement.model';

@Table({ tableName: 'stock', timestamps: true })
export class Stock extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare productId: string;

  @Column({ type: DataType.DECIMAL(14, 3), allowNull: false, defaultValue: 0 })
  declare currentQuantity: number;

  @Column({ type: DataType.DECIMAL(14, 3), allowNull: false, defaultValue: 0 })
  declare minimumQuantity: number;

  @Column({ type: DataType.DECIMAL(14, 3), allowNull: true })
  declare maximumQuantity: number | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare lastMovementAt: Date | null;

  @BelongsTo(() => Product)
  declare product: Product;

  @HasMany(() => InventoryMovement)
  declare movements: InventoryMovement[];
}
