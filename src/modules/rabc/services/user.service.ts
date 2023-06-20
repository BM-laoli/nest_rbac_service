import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PagenationDTO } from 'src/dto/base.dto';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import {
  EntityManager,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  getRepository,
} from 'typeorm';

interface PageInfo {
  page: number;
  pageSize: number;
  total?: number;
}

const DoPagenation = async <T>(
  pageInfo: PageInfo,
  entityManager: EntityManager,
  repository,
  where?: FindOptionsWhere<T>,
  relations?: FindOptionsRelationByString | FindOptionsRelations<T>,
) => {
  const { page, pageSize } = pageInfo;
  const repositoryValue = entityManager.getRepository<T>(repository);
  const [list, total] = await repositoryValue.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: where,
    relations: relations,
  });
  const pageInfoRes: PageInfo = {
    page: Number(page),
    pageSize: Number(pageSize),
    total: Number(total),
  };
  return {
    list,
    pageInfo: pageInfoRes,
  };
};
@Injectable()
export default class UserService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  async getUserList(pageInfo: PagenationDTO) {
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
      const rolePermissions = userRole.roles.rolePermissions;
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

  updateUser(username: string) {}

  deleteUser(username: string) {}
}
