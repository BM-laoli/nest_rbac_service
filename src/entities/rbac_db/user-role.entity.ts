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

// 详见 这个 文档https://typeorm.io/many-to-many-relations#bi-directional-relations
// user-role 中间表
@Entity()
export class UserRole extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserInfo, (user) => user.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  users: UserInfo;

  @ManyToOne(() => RoleInfo, (role) => role.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  roles: RoleInfo;
}
