import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { RolePermission } from './role-permission';
import { UserInfo } from './user-info.entity';
import { UserRole } from './user-role.entity';

@Entity()
export class RoleInfo extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  description: string;

  @OneToMany(() => UserRole, (userRole) => userRole.roles, { cascade: true })
  userRoles: UserRole[];
}
