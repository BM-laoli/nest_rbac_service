import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { Connection, EntityManager } from 'typeorm';

@Injectable()
export default class UserService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  getUserList(username: string) {}

  getUserInfo(username: string) {}

  updateUser(username: string) {}

  deleteUser(username: string) {}
}
