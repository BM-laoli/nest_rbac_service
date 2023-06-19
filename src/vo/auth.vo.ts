import { Exclude, Expose, Type } from 'class-transformer';
import { ActionButton } from 'src/entities/rbac_db/action-button.entity';
import { Menu } from 'src/entities/rbac_db/menu.entity';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';

class UserInfoVO implements UserInfo {
  @Exclude()
  password: string;

  @Exclude()
  userRoles: any[];

  @Expose()
  roles: RoleInfo[];

  @Expose()
  menus: Menu[];

  @Expose()
  actionButons: ActionButton[];

  @Exclude()
  id: number;

  @Exclude()
  state: number;

  @Exclude()
  isDeleted: boolean;

  @Expose()
  username: string;

  email: string;

  create_time: Date;

  update_time: Date;

  constructor(partial: Partial<UserInfoVO>) {
    Object.assign(this, partial);
  }
}

class AuthInfoVO {
  @Expose()
  public token: string;

  @Expose()
  @Type(() => UserInfoVO)
  userInfo: UserInfoVO;

  constructor(partial: Partial<AuthInfoVO>) {
    Object.assign(this, partial);
  }
}

export { AuthInfoVO, UserInfoVO };
