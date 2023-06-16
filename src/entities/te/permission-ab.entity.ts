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

// @Entity()
// export class PermissionAB extends Base {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => ActionButton, (actionButton) => actionButton.permissionABs, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn()
//   actionButton: ActionButton;

//   @ManyToOne(() => Permission, (permission) => permission.permissionABs, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn()
//   permission: Permission;
// }
