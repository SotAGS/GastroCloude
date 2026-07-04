import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { Purchase } from './purchase.model';

@Table({ tableName: 'supplier', timestamps: true, paranoid: true })
export class Supplier extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare businessName: string;

  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare businessNameNormalized: string;

  @Column({ type: DataType.STRING(30), allowNull: true, unique: true })
  declare taxId: string | null;

  @Column({ type: DataType.STRING(120), allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.STRING(30), allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.STRING(200), allowNull: true })
  declare address: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => Purchase)
  declare purchases: Purchase[];
}