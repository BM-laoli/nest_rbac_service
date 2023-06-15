import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
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
    @InjectRepository(RoleInfo, 'rbac_db')
    private readonly roleRepository: Repository<UserRole>,
  ) {}

  async t1() {
    const user1 = new UserInfo();
    user1.username = 'user1';
    user1.email = '123@email.com';
    user1.password = '123';
    user1.state = 1;
    await this.userInfoRepository.save(user1);

    const user2 = new UserInfo();
    user2.username = 'user2';
    user2.email = '123@email.com';
    user2.password = '123';
    user2.state = 1;
    await this.userInfoRepository.save(user1);

    const role1 = new RoleInfo();
    role1.name = 'role1';
    role1.icon = 'role1';
    role1.description = 'role1';

    // 一条数据
    const userRole = new UserRole();
    userRole.users = user1;
    userRole.roles = role1;

    await this.userRoleRepository.save(userRole);

    // 二条数据

    try {
      const value = await this.roleRepository.save(role1);
    } catch (error) {
      log(error);
    } finally {
      log('');
    }
  }

  async t2(data: any) {
    // return this.user_db2Repository.save(data);
  }

  async t3() {
    // return this.user_db2Repository.find();
  }
}
