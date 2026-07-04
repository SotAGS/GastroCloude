import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Supplier } from './supplier.model';
import { User } from './user.model';
import { PurchaseDetail } from './purchase-detail.model';
import { PurchaseStatus } from '../enums/purchase-status.enum';

@Table({ tableName: 'purchase', timestamps: true })
export class Purchase extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Supplier)
  @Column({ type: DataType.UUID, allowNull: false })
  declare supplierId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare createdByUserId: string;

  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  declare purchaseNumber: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare purchaseDate: string;

  @Column({ type: DataType.ENUM(...Object.values(PurchaseStatus)), allowNull: false })
  declare status: PurchaseStatus;

  @Column({ type: DataType.STRING(300), allowNull: true })
  declare observations: string | null;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false, defaultValue: 0 })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false, defaultValue: 0 })
  declare total: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare receivedAt: Date | null;

  @BelongsTo(() => Supplier)
  declare supplier: Supplier;

  @BelongsTo(() => User)
  declare createdBy: User;

  @HasMany(() => PurchaseDetail)
  declare details: PurchaseDetail[];
}