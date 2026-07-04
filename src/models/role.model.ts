import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { RolePermission } from './role-permission.model';

@Table({ tableName: 'role', timestamps: true })
export class Role extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare description: string | null;

  @HasMany(() => User)
  declare users: User[];

  @HasMany(() => RolePermission)
  declare permissions: RolePermission[];
}