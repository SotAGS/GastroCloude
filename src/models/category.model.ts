import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { Product } from './product.model';

@Table({ tableName: 'category', timestamps: true, paranoid: true })
export class Category extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(80), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(80), allowNull: false, unique: true })
  declare nameNormalized: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => Product)
  declare products: Product[];
}
