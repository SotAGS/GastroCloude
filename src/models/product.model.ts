import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { Category } from './category.model';
import { Stock } from './stock.model';
import { PurchaseDetail } from './purchase-detail.model';
import { InventoryMovement } from './inventory-movement.model';

@Table({ tableName: 'product', timestamps: true, paranoid: true })
export class Product extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.UUID, allowNull: false })
  declare categoryId: string;

  @Column({ type: DataType.STRING(40), allowNull: true, unique: true })
  declare sku: string | null;

  @Column({ type: DataType.STRING(120), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(120), allowNull: false, unique: true })
  declare nameNormalized: string;

  @Column({ type: DataType.STRING(300), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare unit: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @BelongsTo(() => Category)
  declare category: Category;

  @HasOne(() => Stock)
  declare stock: Stock;

  @HasMany(() => PurchaseDetail)
  declare purchaseDetails: PurchaseDetail[];

  @HasMany(() => InventoryMovement)
  declare inventoryMovements: InventoryMovement[];
}