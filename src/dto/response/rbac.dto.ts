import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ActionButton } from 'src/entities/rbac_db/action-button.entity';
import { Menu } from 'src/entities/rbac_db/menu.entity';
import { PermissionAB } from 'src/entities/rbac_db/permission-ab.entity';
import { PermissionMenu } from 'src/entities/rbac_db/permission-menu.entity';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { RolePermission } from 'src/entities/rbac_db/role-permission.entity';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { UserRole } from 'src/entities/rbac_db/user-role.entity';
import { PagenationResDTO } from './responseBase.dto';
import { Permission } from 'src/entities/rbac_db/permission.entity';

class ActionButtonResDTO implements ActionButton {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  create_time: Date;

  @ApiProperty()
  @Expose()
  update_time: Date;

  @Exclude()
  permissionABs: PermissionAB[];

  @Exclude()
  isDeleted: boolean;

  constructor(partial: Partial<ActionButtonResDTO>) {
    Object.assign(this, partial);
  }
}

class MenuResDTO implements Menu {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  icon: string;

  @Expose()
  @ApiProperty({
    type: () => [MenuResDTO],
    description: '嵌套的同type',
  })
  @Type(() => MenuResDTO)
  childMenus: MenuResDTO[];

  @Exclude()
  parentMenu: MenuResDTO;

  @Exclude()
  permissionMenus: PermissionMenu[];

  @Exclude()
  isDeleted: boolean;

  @Expose()
  @ApiProperty()
  create_time: Date;

  @Expose()
  @ApiProperty()
  update_time: Date;

  constructor(partial: Partial<MenuResDTO>) {
    Object.assign(this, partial);
  }
}
class RoleInfoResDTO implements RoleInfo {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  icon: string;

  @ApiProperty()
  @Expose()
  description: string;

  @Exclude()
  userRoles: UserRole[];

  @Exclude()
  rolePermissions: RolePermission[];

  @Exclude()
  isDeleted: boolean;

  @ApiProperty()
  @Expose()
  create_time: Date;

  @ApiProperty()
  @Expose()
  update_time: Date;

  constructor(partial: Partial<RoleInfoResDTO>) {
    Object.assign(this, partial);
  }
}

class UserInfoResDTO implements UserInfo {
  @Exclude()
  password: string;

  @Exclude()
  userRoles: any[];

  @ApiProperty({
    type: [RoleInfoResDTO],
  })
  @Expose()
  @Type(() => RoleInfoResDTO)
  roles: RoleInfoResDTO[];

  @ApiProperty({
    type: [MenuResDTO],
  })
  @Expose()
  @Type(() => MenuResDTO)
  menus: MenuResDTO[];

  @ApiProperty({
    type: [ActionButtonResDTO],
  })
  @Expose()
  @Type(() => ActionButtonResDTO)
  actionButtons: ActionButtonResDTO[];

  @Exclude()
  id: number;

  @Exclude()
  state: number;

  @Exclude()
  isDeleted: boolean;

  @Expose()
  @ApiProperty()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  create_time: Date;

  @ApiProperty()
  @Expose()
  update_time: Date;

  constructor(partial: Partial<UserInfoResDTO>) {
    Object.assign(this, partial);
  }
}

class UserDetailResDTO implements UserInfo {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  state: number;

  @ApiProperty()
  @Expose()
  create_time: Date;

  @ApiProperty()
  @Expose()
  update_time: Date;

  @Exclude()
  password: string;

  @Exclude()
  userRoles: UserRole[];

  @Exclude()
  isDeleted: boolean;

  constructor(partial: Partial<UserDetailResDTO>) {
    Object.assign(this, partial);
  }
}

class RoleDetailResDTO implements RoleInfo {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  icon: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  create_time: Date;

  @ApiProperty()
  @Expose()
  update_time: Date;

  // 自实现
  @ApiProperty({
    type: [MenuResDTO],
  })
  @Expose()
  @Type(() => MenuResDTO)
  menus: MenuResDTO[];

  @ApiProperty({
    type: [ActionButtonResDTO],
  })
  @Expose()
  @Type(() => ActionButtonResDTO)
  actionButtons: ActionButtonResDTO[];

  // 忽略
  @Exclude()
  rolePermissions: RolePermission[];

  @Exclude()
  userRoles: UserRole[];

  @Exclude()
  isDeleted: boolean;

  constructor(partial: Partial<RoleDetailResDTO>) {
    Object.assign(this, partial);
  }
}

// 非常特殊的 class 他和 自定义的sawger 装饰器需要结合使用 才能保证效果
class UserInfoListResDTO {
  @Expose()
  @Type(() => PagenationResDTO)
  pageInfo: PagenationResDTO;

  @Expose()
  @Type(() => UserDetailResDTO)
  list: UserDetailResDTO[];

  constructor(partial: Partial<UserInfoListResDTO>) {
    Object.assign(this, partial);
  }
}

class RoleInfoListResDTO {
  @Expose()
  @Type(() => PagenationResDTO)
  pageInfo: PagenationResDTO;

  @Expose()
  @Type(() => RoleInfoResDTO)
  list: RoleInfoResDTO[];

  constructor(partial: Partial<RoleInfoListResDTO>) {
    Object.assign(this, partial);
  }
}

class ActionButtonListResDTO {
  @Expose()
  @Type(() => PagenationResDTO)
  pageInfo: PagenationResDTO;

  @Expose()
  @Type(() => ActionButtonResDTO)
  list: ActionButtonResDTO[];

  constructor(partial: Partial<ActionButtonListResDTO>) {
    Object.assign(this, partial);
  }
}

class PermissionResDTO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  create_time: Date;

  @ApiProperty()
  @Expose()
  update_time: Date;

  @ApiProperty({
    type: [RoleInfoResDTO],
  })
  @Expose()
  @Type(() => RoleInfoResDTO)
  roles: RoleInfoResDTO[];

  @ApiProperty({
    type: [ActionButtonResDTO],
  })
  @Expose()
  @Type(() => ActionButtonResDTO)
  actionButtons: ActionButtonResDTO[];

  @ApiProperty({
    type: [MenuResDTO],
  })
  @Expose()
  @Type(() => MenuResDTO)
  menus: MenuResDTO[];

  @Exclude()
  isDeleted: boolean;
  constructor(partial: Partial<PermissionResDTO>) {
    Object.assign(this, partial);
  }

  @Exclude()
  rolePermissions: any[];

  @Exclude()
  permissionMenus: any[];

  @Exclude()
  permissionABs: any[];
}

class PermissionSimpleResDTO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  create_time: Date;

  @ApiProperty()
  @Expose()
  update_time: Date;

  @Exclude()
  isDeleted: boolean;
  constructor(partial: Partial<PermissionListResDTO>) {
    Object.assign(this, partial);
  }
}

class PermissionListResDTO {
  @Expose()
  @Type(() => PagenationResDTO)
  pageInfo: PagenationResDTO;

  @Expose()
  @Type(() => PermissionSimpleResDTO)
  list: PermissionSimpleResDTO[];

  constructor(partial: Partial<PermissionListResDTO>) {
    Object.assign(this, partial);
  }
}

export {
  UserInfoListResDTO,
  UserDetailResDTO,
  RoleInfoListResDTO,
  UserInfoResDTO,
  ActionButtonResDTO,
  MenuResDTO,
  RoleInfoResDTO,
  RoleDetailResDTO,
  ActionButtonListResDTO,
  PermissionResDTO,
  PermissionSimpleResDTO,
  PermissionListResDTO,
};
