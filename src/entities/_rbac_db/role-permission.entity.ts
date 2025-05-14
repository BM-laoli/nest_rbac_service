import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { RoleInfo } from './role-info.entity';
import { Base } from './base';

@Entity()
export class RolePermission extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoleInfo, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  roles: RoleInfo;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'permission_id',
    referencedColumnName: 'id',
  })
  permission: Permission;

  @PrimaryColumn()
  role_id: number;

  @PrimaryColumn()
  permission_id: number;
}
