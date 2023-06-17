import { Injectable } from '@nestjs/common';
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
  InjectConnection,
} from '@nestjs/typeorm';
import { MIN } from 'class-validator';
import { log } from 'console';
import { ActionButton } from 'src/entities/rbac_db/action-button.entity';
import { Menu } from 'src/entities/rbac_db/menu.entity';
import { PermissionAB } from 'src/entities/rbac_db/permission-ab.entity';
import { PermissionMenu } from 'src/entities/rbac_db/permission-menu.entity';
import { Permission } from 'src/entities/rbac_db/permission.entity';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { RolePermission } from 'src/entities/rbac_db/role-permission.entity';
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
    // const value = await this.generateTestMenu();
    // const value = await this.getMenus();
    console.log('value => ', value);
    return value;
  }

  async t2() {
    // const value = await this.generateAB();
    // const value = await this.getAB();
    // const value = await this.generatePermission();
    // const value = await this.genratePermissionMenus();
    // const value = await this.genratePermissionAB();
    // const value = await this.genratePermissionRole();
    const value = await this.getUserAll();

    console.log(value);
    return value;
  }

  async t3() {
    // return this.user_db2Repository.find();
  }

  // 测试 User & Roe & user-role
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
      // 使用这种方式的话 你需要 进行 Serializer
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.roles', 'role')
      .getMany();
    // 纯sql 小心使用因为会存在 sql 注入的风险 （因为看起来爽 且直观
    // .select([
    //   'user.id',
    //   'user.username',
    //   'user.email',
    //   'user.state',
    //   `JSON_ARRAYAGG(
    //   JSON_OBJECT(
    //     'id', role.id,
    //     'name', role.name,
    //     'icon', role.icon,
    //     'description', role.description
    //   )
    // ) AS roles`,
    // ])
    // .leftJoin('user.userRoles', 'userRole')
    // .leftJoin('userRole.roles', 'role')
    // .groupBy('user.id')
    // .getRawMany();
    return usersWithRoles;
  }

  // 测试 menu
  async generateTestMenu() {
    const m1 = new Menu();
    m1.name = '首页';
    m1.type = 2;
    m1.icon = 'fa-cog';
    m1.description = '首页';

    await this.connection.manager.save(Menu, m1);

    const m2 = new Menu();
    m2.name = '系统管理';
    m2.type = 1;
    m2.icon = 'fa-cog';
    m2.description = '系统管理';

    const m3 = new Menu();
    m3.name = '用户管理';
    m3.type = 2;
    m3.icon = 'fa-cog';
    m3.description = '用户管理';

    m2.childMenus = [m3];
    await this.connection.manager.save(Menu, m2);
  }

  async getMenus() {
    const allDBValue = await this.entityManager
      .createQueryBuilder(Menu, 'menu')
      .leftJoinAndSelect('menu.childMenus', 'childMenus')
      .getMany();

    const res = allDBValue.map((m) => ({
      ...m,
      childMenus: m.childMenus.map((c) => ({ ...c })),
    }));

    return res;
  }

  // 测试 action-button
  async generateAB() {
    const acb = new ActionButton();
    acb.name = '按钮1';
    acb.code = 'ACB_1';
    acb.type = 1;
    acb.description = '按钮1';

    const acb_2 = new ActionButton();
    acb_2.name = '按钮1';
    acb_2.code = 'ACb_2_1';
    acb_2.type = 1;
    acb_2.description = '按钮1';

    const acb_3 = new ActionButton();
    acb_3.name = '按钮3';
    acb_3.code = 'ACb_3_1';
    acb_3.type = 1;
    acb_3.description = '按钮3';

    return await this.entityManager.save(ActionButton, [acb, acb_2, acb_3]);
  }

  async getAB() {
    return await this.entityManager
      .createQueryBuilder(ActionButton, 'ActionButton')
      .getMany();
  }

  // 测试 permission
  async generatePermission() {
    const permission1 = new Permission();
    permission1.name = 'p1';
    permission1.description = 'p1';

    const permission2 = new Permission();
    permission2.name = 'p2';
    permission2.description = 'p2';
    return await this.entityManager.save(Permission, [
      permission1,
      permission2,
    ]);
  }

  // 测试 permssion-menus
  async genratePermissionMenus() {
    const menu1 = await this.entityManager
      .createQueryBuilder(Menu, 'Menu')
      .getMany();
    // 把权限都给加上
    const permissions = await this.entityManager
      .createQueryBuilder(Permission, 'Permission')
      .where('Permission.name = :name', { name: 'p1' })
      .getOne();

    const permissionMenu = new PermissionMenu();
    permissionMenu.menu = menu1[0];

    const permissionMenu2 = new PermissionMenu();
    permissionMenu2.menu = menu1[1];

    const permissionMenu3 = new PermissionMenu();
    permissionMenu3.menu = menu1[2];

    permissions.permissionMenus = [
      permissionMenu,
      permissionMenu2,
      permissionMenu3,
    ];

    // const value = await this.connection.transaction(async (manager) => {
    //   // save UserInfo and roleInfo entity
    //   await manager.save([
    //     permissions,
    //     permissionMenu,
    //     permissionMenu2,
    //     permissionMenu3,
    //   ]);

    //   // 设置userRole1和userRole2的users和roles字段
    //   permissionMenu.permission = permissions;
    //   permissionMenu.menu = menu1[0];

    //   permissionMenu2.permission = permissions;
    //   permissionMenu2.menu = menu1[1];

    //   permissionMenu3.permission = permissions;
    //   permissionMenu3.menu = menu1[2];

    //   // 保存UserRole实体
    //   await manager.save([permissionMenu, permissionMenu2, permissionMenu3]);
    // });

    const queryValue = await this.entityManager
      .createQueryBuilder(Permission, 'permission')
      .select([
        'permission.id',
        'permission.name',
        `JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', menu.id,
            'name', menu.name
          )
        ) AS menus`,
      ])
      .leftJoin('permission.permissionMenus', 'permissionMenus')
      .leftJoin('permissionMenus.menu', 'menu')
      .groupBy('permission.id')
      .getRawMany();

    return queryValue;
  }

  // 测试 permission-ab
  async genratePermissionAB() {
    const ACB = await this.entityManager
      .createQueryBuilder(ActionButton, 'ActionButton')
      .getMany();
    // 把权限都给加上
    const permissions = await this.entityManager
      .createQueryBuilder(Permission, 'Permission')
      .where('Permission.name = :name', { name: 'p1' })
      .getOne();

    const permissionAB = new PermissionAB();
    permissionAB.actionButton = ACB[0];

    const permissionAB2 = new PermissionAB();
    permissionAB2.actionButton = ACB[1];

    const permissionAB3 = new PermissionAB();
    permissionAB3.actionButton = ACB[2];

    permissions.permissionABs = [permissionAB, permissionAB2, permissionAB3];

    // const value = await this.connection.transaction(async (manager) => {
    //   // save UserInfo and roleInfo entity
    //   await manager.save([
    //     permissions,
    //     permissionAB,
    //     permissionAB2,
    //     permissionAB3,
    //   ]);

    //   // 设置userRole1和userRole2的users和roles字段
    //   permissionAB.permission = permissions;
    //   permissionAB.actionButton = ACB[0];

    //   permissionAB2.permission = permissions;
    //   permissionAB2.actionButton = ACB[1];

    //   permissionAB3.permission = permissions;
    //   permissionAB3.actionButton = ACB[2];

    //   // 保存UserRole实体
    //   await manager.save([permissionAB, permissionAB2, permissionAB3]);
    // });

    const queryValue = await this.entityManager
      .createQueryBuilder(Permission, 'permission')
      .select([
        'permission.id',
        'permission.name',
        `JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', actionButton.id,
            'name', actionButton.name,
            'code', actionButton.code
          )
        ) AS actionButton`,
      ])
      .leftJoin('permission.permissionABs', 'permissionABs')
      .leftJoin('permissionABs.actionButton', 'actionButton')
      .groupBy('permission.id')
      .getRawMany();

    return queryValue;
  }

  // 测试 permission-role
  async genratePermissionRole() {
    const role = (
      await this.entityManager
        .createQueryBuilder(RoleInfo, 'RoleInfo')
        .getMany()
    )[0];

    // 把权限都给加上
    const permissions = await this.entityManager
      .createQueryBuilder(Permission, 'Permission')
      .where('Permission.name = :name', { name: 'p1' })
      .getOne();
    const permissions2 = await this.entityManager
      .createQueryBuilder(Permission, 'Permission')
      .where('Permission.name = :name', { name: 'p2' })
      .getOne();

    const permissionRole = new RolePermission();
    permissionRole.permission = permissions;
    permissionRole.roles = role;
    // 无法自动关联 需要你自己关联
    permissionRole.permission_id = permissions.id;
    permissionRole.role_id = role.id;

    const permissionRole2 = new RolePermission();
    permissionRole2.permission = permissions2;
    permissionRole2.roles = role;
    permissionRole2.permission_id = permissions2.id;
    permissionRole2.role_id = role.id;

    role.rolePermissions = [permissionRole, permissionRole2];

    // const value = await this.connection.transaction(async (manager) => {
    //   // save UserInfo and roleInfo entity
    //   await manager.save([role, permissionRole, permissionRole2]);

    //   permissionRole.permission = permissions;
    //   permissionRole.roles = role;

    //   permissionRole2.permission = permissions2;
    //   permissionRole2.roles = role;

    //   // // 保存UserRole实体
    //   await manager.save([permissionRole, permissionRole2]);
    // });

    const queryValue = await this.entityManager
      .createQueryBuilder(RoleInfo, 'RoleInfo')
      .select([
        'RoleInfo.id',
        'RoleInfo.name',
        `JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', permission.id,
            'name', permission.name
          )
        ) AS permissions`,
      ])
      .leftJoin('RoleInfo.rolePermissions', 'rolePermissions')
      .leftJoin('rolePermissions.permission', 'permission')
      .groupBy('RoleInfo.id')
      .getRawMany();
    return queryValue;
    // return value;
  }

  // 完整测试 从 user 查起 把 他的role permission menu acb 都查出来
  // 注意数据的一致性问题
  async getUserAll() {
    // return await this.entityManager
    //   .createQueryBuilder(UserInfo, 'UserInfo')
    //   .getMany();

    const rolePermission = await this.connection
      .getRepository(RolePermission)
      .findOne({
        where: {
          role_id: 1,
          // permission_id: 2,
        },
        relations: ['roles', 'permission'],
      });
    return rolePermission;
  }
}
