import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Base } from './base';
import { RoleInfo } from './role-info.entity';
import { UserRole } from './user-role.entity';

@Entity()
export class UserInfo extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    select: false, // 查询时要 hidden 掉
  })
  password: string;

  @Column({
    type: 'int',
    default: 1,
    comment: '1 禁用 2 启用',
  })
  state: number;

  @ManyToMany(() => RoleInfo, (role) => role.users)
  @JoinTable()
  roles: RoleInfo[];
}
