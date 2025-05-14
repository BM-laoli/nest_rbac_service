import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/der_w_calorie/user-info.entity';
import { EntityManager } from 'typeorm';
import { encryptPassword } from '../utils/crypt';
import { UserInfoReqDTO } from 'src/dto/request/rbac.dto';

interface InterFind {
  username?: string;
  id?: number;
}
@Injectable()
export default class AuthUserService {
  constructor(
    @InjectEntityManager('der_w_calorie')
    private entityManager: EntityManager,
  ) {}

  async findOne(useInfo: InterFind) {
    const sqlRes = await this.entityManager.findOne(UserInfo, {
      where: { username: useInfo.username, id: useInfo.id },
    });


    return {
      ...sqlRes,
    };
  }

  async register(user: UserInfoReqDTO) {
    user = {
      ...user,
      password: encryptPassword(user.password),
    };
    const saveRes = await this.entityManager.save(UserInfo, user as any);
    return this.findOne({ id: saveRes.id });
  }
}
