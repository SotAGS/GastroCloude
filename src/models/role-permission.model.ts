import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from './role.model';

@Table({ tableName: 'role_permission', timestamps: true })
export class RolePermission extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  declare roleId: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare module: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare action: string;

  @BelongsTo(() => Role)
  declare role: Role;
}
