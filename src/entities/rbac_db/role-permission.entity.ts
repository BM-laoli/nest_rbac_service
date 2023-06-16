import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
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
  @JoinColumn()
  roles: RoleInfo;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  permission: Permission;
}
