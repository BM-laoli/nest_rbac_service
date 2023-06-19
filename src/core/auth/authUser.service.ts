import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { Connection, EntityManager } from 'typeorm';
import { encryptPassword } from '../utils/crypt';
import { UserInfoDTO } from 'src/dto/userInfo.dto';

interface InterFind {
  username?: string;
  id?: number;
}
@Injectable()
export default class AuthUserService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  async findOne(useInfo: InterFind) {
    return this.entityManager.findOne(UserInfo, {
      where: { username: useInfo.username, id: useInfo.id },
      relations: {
        userRoles: true,
      },
    });
  }

  async register(user: UserInfoDTO) {
    user = {
      ...user,
      password: encryptPassword(user.password),
    };
    const saveRes = await this.entityManager.save(UserInfo, user as any);
    return this.findOne({ id: saveRes.id });
  }
}
