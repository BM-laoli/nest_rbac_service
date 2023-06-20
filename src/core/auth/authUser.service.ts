import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { EntityManager } from 'typeorm';
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
    const sqlRes = await this.entityManager.findOne(UserInfo, {
      where: { username: useInfo.username, id: useInfo.id },
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
      const rolePermissions = userRole.roles.rolePermissions;
      rolePermissions.forEach((rolePermission) => {
        const permission = rolePermission.permission;
        const permissionABs = permission.permissionABs;
        permissionABs.forEach((permissionMenu) => {
          const actionButton = permissionMenu.actionButton;
          if (!actionButtonMap.has(actionButton.id)) {
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

  async register(user: UserInfoDTO) {
    user = {
      ...user,
      password: encryptPassword(user.password),
    };
    const saveRes = await this.entityManager.save(UserInfo, user as any);
    return this.findOne({ id: saveRes.id });
  }
}
