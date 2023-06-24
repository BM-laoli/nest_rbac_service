import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Base } from '../rbac_db/base';
import { PermissionMenu } from './permission-menu.entity';

@Entity()
@Tree('materialized-path')
export class Menu extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    comment: '菜单类型 1 目录 2 实际菜单 类型目录的时候 childMenus 才有值',
  })
  type: number;

  @Column()
  description: string;

  @Column()
  icon: string;

  // 如果进行嵌套树?
  @TreeParent()
  parentMenu: Menu;

  // 一般而言 OneToMany 的这一边为 虚拟键
  @TreeChildren()
  childMenus: Menu[];

  // 虚拟键
  @OneToMany(() => PermissionMenu, (premissionMenu) => premissionMenu.menu, {
    cascade: true,
  })
  permissionMenus: PermissionMenu[];
}

// 这里有一篇官方文档 https://typeorm.io/tree-entities
