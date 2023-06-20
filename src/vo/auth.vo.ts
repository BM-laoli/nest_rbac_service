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

class ActionButtonVO implements ActionButton {
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

  constructor(partial: Partial<ActionButtonVO>) {
    Object.assign(this, partial);
  }
}
class MenuVO implements Menu {
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

  @ApiProperty({
    type: () => MenuVO,
    description: '嵌套的同type',
  })
  @Expose()
  parentMenu: MenuVO;

  @Expose()
  @ApiProperty({
    type: () => [MenuVO],
    description: '嵌套的同type',
  })
  childMenus: MenuVO[];

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

  constructor(partial: Partial<MenuVO>) {
    Object.assign(this, partial);
  }
}
class RoleInfoVO implements RoleInfo {
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

  constructor(partial: Partial<RoleInfoVO>) {
    Object.assign(this, partial);
  }
}
class UserInfoVO implements UserInfo {
  @Exclude()
  password: string;

  @Exclude()
  userRoles: any[];

  @ApiProperty({
    type: [RoleInfoVO],
  })
  @Expose()
  @Type(() => RoleInfoVO)
  roles: RoleInfoVO[];

  @ApiProperty({
    type: [MenuVO],
  })
  @Expose()
  @Type(() => MenuVO)
  menus: MenuVO[];

  @ApiProperty({
    type: [ActionButtonVO],
  })
  @Expose()
  @Type(() => ActionButtonVO)
  actionButtons: ActionButtonVO[];

  @Exclude()
  id: number;

  @Exclude()
  state: number;

  @Exclude()
  isDeleted: boolean;

  @Expose()
  @ApiProperty()
  username: string;

  email: string;

  create_time: Date;

  update_time: Date;

  constructor(partial: Partial<UserInfoVO>) {
    Object.assign(this, partial);
  }
}

class AuthInfoVO {
  @ApiProperty({
    description: 'token',
  })
  @Expose()
  public token: string;

  @Expose()
  @Type(() => UserInfoVO)
  @ApiProperty({
    type: UserInfoVO,
  })
  userInfo: UserInfoVO;

  constructor(partial: Partial<AuthInfoVO>) {
    Object.assign(this, partial);
  }
}

export { AuthInfoVO, UserInfoVO };
