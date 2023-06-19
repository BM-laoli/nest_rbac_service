import {
  Exclude,
  Expose,
  Transform,
  Type,
  classToPlain,
} from 'class-transformer';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { UserRole } from 'src/entities/rbac_db/user-role.entity';

class UserInfoVO implements UserInfo {
  @Exclude()
  password: string;

  @Expose()
  userRoles: UserRole[];

  @Expose()
  @Transform((obj) => {
    return obj.obj;
  })
  get roles(): Array<RoleInfo> {
    console.log(this.userRoles);

    return this.userRoles.map((item) => ({ ...item.roles }));
  }

  constructor(partial: Partial<UserInfoVO>) {
    // super();
    Object.assign(this, partial);
  }
  @Exclude()
  id: number;

  @Exclude()
  state: number;
  å;
  @Exclude()
  isDeleted: boolean;

  @Expose()
  username: string;

  email: string;

  create_time: Date;

  update_time: Date;
}

class AuthInfoVO {
  @Expose()
  public token: string;

  @Expose()
  @Type(() => UserInfoVO)
  @Transform((value) => {
    return {
      ...value.value,
    };
  })
  userInfo: UserInfoVO;

  constructor(partial: Partial<AuthInfoVO>) {
    Object.assign(this, partial);
  }
}

export { AuthInfoVO, UserInfoVO };
