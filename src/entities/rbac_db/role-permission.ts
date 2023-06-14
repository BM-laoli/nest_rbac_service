import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { RoleInfo } from './role-info.entity';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => RoleInfo, (role) => role.rolePermissions)
  roles: RoleInfo[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];
}
