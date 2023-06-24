import {
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  isNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialIdDTO } from '../base.dto';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { UserRole } from 'src/entities/rbac_db/user-role.entity';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { RolePermission } from 'src/entities/rbac_db/role-permission.entity';
import { ActionButton } from 'src/entities/rbac_db/action-button.entity';
import { PermissionAB } from 'src/entities/rbac_db/permission-ab.entity';
import { Menu } from 'src/entities/rbac_db/menu.entity';
import { PermissionMenu } from 'src/entities/rbac_db/permission-menu.entity';
import { Permission } from 'src/entities/rbac_db/permission.entity';

// 注意 class UserInfoReqDTO extends   在swager
// 不能正确 使用 PartialType，但是直接extends PartialId 可以
// class UserInfoReqDTO extends PartialId {
class AuthLoginReqDTO extends PartialIdDTO {
  @ApiProperty()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty()
  @IsEmail({})
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

class UpdateUserInfoReqDTO extends PartialIdDTO {
  @ApiProperty()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty()
  @IsEmail({})
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  // @ValidateNested()
  @ApiProperty()
  roles?: Array<number>;
}

class UpdateAndCreateRoleInfoReqDTO extends PartialIdDTO {
  @ApiProperty({
    required: false,
  })
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  icon: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  permissionIds?: number[];

  isDeleted?: boolean;
  create_time?: Date;
  update_time?: Date;
  userRoles: UserRole[];
  rolePermissions: RolePermission[];
}

class UserInfoReqDTO extends AuthLoginReqDTO {}

class ACBInfoReqDTO extends PartialIdDTO {
  @ApiProperty({
    required: false,
  })
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  type: number;

  @ApiProperty()
  description: string;
}

class MenuCreateReqDTO extends PartialIdDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  type: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  icon: string;

  @ApiProperty({
    required: false,
  })
  parentMenuID: number;

  childMenus: Menu[];
  permissionMenus: PermissionMenu[];
  isDeleted: boolean;
  create_time: Date;
  update_time: Date;
}

class PermissionReqDTO extends PartialIdDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    required: false,
    type: [Number],
  })
  roles?: number[];

  @ApiProperty({
    type: [Number],
  })
  actionButtoins: number[];

  @ApiProperty({
    type: [Number],
  })
  menus: number[];

  isDeleted: boolean;
  create_time: Date;
  update_time: Date;
}

export {
  AuthLoginReqDTO,
  UpdateUserInfoReqDTO,
  UserInfoReqDTO,
  UpdateAndCreateRoleInfoReqDTO,
  ACBInfoReqDTO,
  MenuCreateReqDTO,
  PermissionReqDTO,
};
