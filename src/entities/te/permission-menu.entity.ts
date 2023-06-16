// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   ManyToMany,
//   JoinTable,
//   JoinColumn,
//   ManyToOne,
// } from 'typeorm';
// import { Permission } from './permission.entity';
// import { RoleInfo } from './role-info.entity';
// import { Base } from './base';
// import { ActionButton } from './action-button.entity';
// import { Menu } from './menu.entity';

// @Entity()
// export class PermissionMenu extends Base {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Menu, (menu) => menu.permissionMenus, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn()
//   menu: Menu;

//   @ManyToOne(() => Permission, (permission) => permission.permissionMenus, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn()
//   permission: Permission;
// }
