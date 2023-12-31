import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { RolePermission } from './role-permission.entity';
import { UserInfo } from './user-info.entity';
import { UserRole } from './user-role.entity';

@Entity()
export class RoleInfo extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  icon: string;

  @Column()
  description: string;

  // 虚拟的key 表中是没有的
  @OneToMany(() => UserRole, (userRole) => userRole.roles, { cascade: true })
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.roles, {
    cascade: true,
  })
  rolePermissions: RolePermission[];
}
