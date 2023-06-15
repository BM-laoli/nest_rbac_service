import { Injectable } from '@nestjs/common';
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
  InjectConnection,
} from '@nestjs/typeorm';
import { log } from 'console';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { UserRole } from 'src/entities/rbac_db/user-role.entity';
import { Connection, DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(UserInfo, 'rbac_db')
    private readonly userInfoRepository: Repository<UserInfo>,
    @InjectRepository(UserRole, 'rbac_db')
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(RoleInfo, 'rbac_db')
    private readonly roleRepository: Repository<UserRole>,
    @InjectDataSource('rbac_db')
    private dataSource: DataSource,
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
    @InjectConnection('rbac_db')
    private connection: Connection,
  ) {}

  async t1() {
    // const value = await this.generateTestManyToMany();
    const value = await this.queryTestManyToMany();
    console.log(value);
    return {
      name: '1',
    };
  }

  async t2(data: any) {
    // return this.user_db2Repository.save(data);
  }

  async t3() {
    // return this.user_db2Repository.find();
  }

  async generateTestManyToMany() {
    const user = new UserInfo();
    user.username = 'JohnDoe';
    user.email = 'johndoe@example.com';
    user.password = 'password123';
    user.state = 2;

    const role1 = new RoleInfo();
    role1.name = 'admin';
    role1.icon = 'fa-user-secret';
    role1.description = '管理员';

    const role2 = new RoleInfo();
    role2.name = 'editor';
    role2.icon = 'fa-edit';
    role2.description = '编辑人员';

    const userRole1 = new UserRole();
    userRole1.users = Object.assign(new UserInfo(), user);
    userRole1.roles = role1;

    const userRole2 = new UserRole();
    userRole2.users = Object.assign(new UserInfo(), user);
    userRole2.roles = role2;

    user.userRoles = [userRole1, userRole2];

    return await this.connection.transaction(async (manager) => {
      // save UserInfo and roleInfo entity
      await manager.save([user, role1, role2]);

      // 设置userRole1和userRole2的users和roles字段
      userRole1.users = user;
      userRole1.roles = role1;
      userRole2.users = user;
      userRole2.roles = role2;

      // 保存UserRole实体
      await manager.save([userRole1, userRole2]);
    });
  }

  async queryTestManyToMany() {
    const usersWithRoles = await this.userInfoRepository
      .createQueryBuilder('user')
      // .leftJoinAndSelect('user.userRoles', 'userRole')
      // .leftJoinAndSelect('userRole.roles', 'role')
      // .getMany();
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.roles', 'role')
      .addSelect(['role.id', 'role.name', 'role.icon', 'role.description'])
      .select(['user.id', 'user.username', 'user.email', 'user.state'])
      .getMany();
    return usersWithRoles;
  }
}
