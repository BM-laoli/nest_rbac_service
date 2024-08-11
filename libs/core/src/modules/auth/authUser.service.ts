import { UserInfoReqDTO } from '@app/core/dto/requestBase.dto';
import { UserInfo } from '@app/core/dto/responseBase.dto';
import { encryptPassword } from '@app/core/utils/crypt';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export default class AuthUserService {
  constructor(
    // db 的名字
    @InjectEntityManager('sys_iam')
    private entityManager: EntityManager,
  ) {}

  async findOne(value: { username?: string; id?: number }) {
    const v = await this.entityManager.findOne(UserInfo, {
      where: value,
    });
    return v;
  }

  async register(user: UserInfoReqDTO) {
    user = {
      ...user,
      password: encryptPassword(user.password),
    };
    console.log('user', user);
    const saveRes = await this.entityManager.save(UserInfo, user as any);
    return this.entityManager.findOne(UserInfo, {
      where: { id: saveRes.id },
    });
  }
}
