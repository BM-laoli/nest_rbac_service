import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { RoleInfo } from './role-info.entity';
import { UserInfo } from './user-info.entity';

// user-role 中间表
@Entity()
export class UserRole extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserInfo, (user) => user.roles, { onDelete: 'CASCADE' })
  user: UserInfo;

  @ManyToOne(() => RoleInfo, (role) => role.users, { onDelete: 'CASCADE' })
  role: RoleInfo;
}
