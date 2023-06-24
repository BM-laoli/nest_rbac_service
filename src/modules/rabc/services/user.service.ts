import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DoPagenation } from 'src/core/utils/pagenation';
import { UpdateUserInfoReqDTO } from 'src/dto/request/rbac.dto';
import { PagenationReqDTO } from 'src/dto/request/requestBase.dto';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { UserRole } from 'src/entities/rbac_db/user-role.entity';
import {
  EntityManager,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  getRepository,
} from 'typeorm';

@Injectable()
export default class UserService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  async getUserList(pageInfo: PagenationReqDTO) {
    const res = await DoPagenation<UserInfo>(
      pageInfo,
      this.entityManager,
      UserInfo,
      {},
      {},
    );
    return res;
  }

  async getUserInfo(id: number) {
    const sqlRes = await this.entityManager.findOne(UserInfo, {
      where: { id: id },
      relations: {
        userRoles: {
          roles: {
            rolePermissions: {
              permission: {
                permissionMenus: {
                  menu: true,
                },
                permissionABs: {
                  actionButton: true,
                },
              },
            },
          },
        },
      },
    });

    const menusMap = new Map();
    const menus = sqlRes.userRoles.reduce((prev, userRole) => {
      const rolePermissions = userRole.roles.rolePermissions;
      rolePermissions.forEach((rolePermission) => {
        const permission = rolePermission.permission;
        const permissionMenus = permission.permissionMenus;
        permissionMenus.forEach((permissionMenu) => {
          const menu = permissionMenu.menu;
          if (!menusMap.has(menu.id)) {
            menusMap.set(menu.id, true);
            prev.push(menu);
          }
        });
      });
      return prev;
    }, []);

    const actionButtonMap = new Map();
    const actionButtons = sqlRes.userRoles.reduce((prev, userRole) => {
      const rolePermissions = userRole.roles?.rolePermissions;
      rolePermissions.forEach((rolePermission) => {
        const permission = rolePermission.permission;
        const permissionABs = permission.permissionABs;
        permissionABs?.forEach((permissionMenu) => {
          const actionButton = permissionMenu.actionButton;
          if (actionButton && !actionButtonMap.has(actionButton.id)) {
            actionButtonMap.set(actionButton.id, true);
            prev.push(actionButton);
          }
        });
      });
      return prev;
    }, []);

    const roles = sqlRes.userRoles.map((item) => {
      delete item.roles.rolePermissions;
      return { ...item.roles };
    });

    return {
      ...sqlRes,
      roles,
      menus,
      actionButtons,
    };
  }

  async updateUser(userInfo: UpdateUserInfoReqDTO) {
    let user = await this.entityManager.findOne(UserInfo, {
      where: { id: userInfo.id },
      relations: {
        userRoles: true,
      },
    });

    const role = await this.entityManager.findByIds(RoleInfo, userInfo.roles);
    let newUserRoles = role?.map((item) => {
      return Object.assign(new UserRole(), {
        roles: item,
      });
    });

    await this.entityManager.remove(UserRole, user.userRoles);
    if (userInfo.roles.length) {
      await this.entityManager.save(UserRole, newUserRoles);
    }
    delete user.userRoles;
    user = {
      ...user,
      ...userInfo,
    };
    const { id } = await this.entityManager.save(UserInfo, user, {});
    newUserRoles = newUserRoles.map((item) => ({ ...item, users: user }));
    if (userInfo.roles.length) {
      await this.entityManager.save(UserRole, newUserRoles);
    }
    return this.getUserInfo(id);
  }

  deleteUser(ids: Array<number>) {
    return this.entityManager.delete(UserInfo, ids);
  }
}
