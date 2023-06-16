import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from '../rbac_db/base';
import { PermissionMenu } from './permission-menu.entity';

@Entity()
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
  @ManyToOne(() => Menu, (menu) => menu.childMenus)
  parentMenu: Menu;

  @OneToMany(() => Menu, (menu) => menu.parentMenu, { cascade: true })
  childMenus: Menu[];

  // 虚拟键
  @OneToMany(() => PermissionMenu, (premissionMenu) => premissionMenu.menu, {
    cascade: true,
  })
  permissionMenus: PermissionMenu[];
}
