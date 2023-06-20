import { Exclude, Expose, Type } from 'class-transformer';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { UserRole } from 'src/entities/rbac_db/user-role.entity';
import { User_db2 } from 'src/entities/rbac_db_1/te2.entity';
import { PagenationVO } from './base.vo';
import { Transaction } from 'typeorm';

export class VOTest extends User_db2 {
  @Exclude()
  id: number;

  @Expose()
  get full_username(): string {
    return `___${this.username}`;
  }

  constructor(partial: Partial<VOTest>) {
    super();
    Object.assign(this, partial);
  }
}

export class VOUserInfo extends UserInfo {
  @Exclude()
  userRoles: UserRole[];

  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  state: number;

  @Expose()
  get roles(): Array<RoleInfo> {
    return this.userRoles.map((item) => ({ ...item.roles }));
  }

  constructor(partial: Partial<VOTest>) {
    super();
    Object.assign(this, partial);
  }
}

class UserInfoDetailInfo implements UserInfo {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  state: number;
  @Expose()
  create_time: Date;
  @Expose()
  update_time: Date;

  @Exclude()
  password: string;
  @Exclude()
  userRoles: UserRole[];
  @Exclude()
  isDeleted: boolean;

  constructor(partial: Partial<UserInfoDetailInfo>) {
    Object.assign(this, partial);
  }
}

class UserInfoListVO {
  @Expose()
  @Type(() => PagenationVO)
  pageInfo: PagenationVO;

  @Expose()
  @Type(() => UserInfoDetailInfo)
  list: UserInfoDetailInfo[];

  constructor(partial: Partial<UserInfoListVO>) {
    Object.assign(this, partial);
  }
}

export { UserInfoListVO, UserInfoDetailInfo };
