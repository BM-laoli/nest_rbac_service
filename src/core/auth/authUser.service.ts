import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { Connection, EntityManager } from 'typeorm';

@Injectable()
export default class AuthUserService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  async findOne(username: string) {
    return this.entityManager.findOne(UserInfo, {
      where: { username: username },
    });
  }
}
