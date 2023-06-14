import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { UserRole } from 'src/entities/rbac_db/user-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(UserInfo, 'rbac_db')
    private readonly userInfoRepository: Repository<UserInfo>,
    @InjectRepository(UserRole, 'rbac_db')
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async t1(data: any) {
    console.log(data);
    // this.entityManager.save(User_db1, data);
    throw new Error('error');

    // return this.user_db1Repository.save(data);
  }

  async t2(data: any) {
    // return this.user_db2Repository.save(data);
  }

  async t3() {
    // return this.user_db2Repository.find();
  }
}
