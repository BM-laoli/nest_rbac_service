import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { RolePermission } from './role-permission.entity';
import { PermissionAB } from './permission-ab.entity';
import { PermissionMenu } from './permission-menu.entity';

@Entity()
export class Permission extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  // 虚拟键
  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
    { cascade: true },
  )
  rolePermissions: RolePermission[];

  @OneToMany(
    () => PermissionAB,
    (rolePermission) => rolePermission.permission,
    { cascade: true },
  )
  permissionABs: PermissionAB[];

  @OneToMany(
    () => PermissionMenu,
    (permissionMenu) => permissionMenu.permission,
    { cascade: true },
  )
  permissionMenus: PermissionMenu[];
}
