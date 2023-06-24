import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DoPagenation } from 'src/core/utils/pagenation';
import { PermissionReqDTO } from 'src/dto/request/rbac.dto';
import { PagenationReqDTO } from 'src/dto/request/requestBase.dto';
import { ActionButton } from 'src/entities/rbac_db/action-button.entity';
import { Menu } from 'src/entities/rbac_db/menu.entity';
import { PermissionAB } from 'src/entities/rbac_db/permission-ab.entity';
import { PermissionMenu } from 'src/entities/rbac_db/permission-menu.entity';
import { Permission } from 'src/entities/rbac_db/permission.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export default class PermissionService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  async genratePermission(
    newPermission: Permission,
    menusIds: number[],
    actionButtoinsIds: number[],
  ) {
    const menus = await this.entityManager.findByIds(Menu, menusIds);

    const actionButtons = await this.entityManager.findByIds(
      ActionButton,
      actionButtoinsIds,
    );

    await this.entityManager.save(Permission, newPermission);

    // 先存 中间表
    const permissionMenus = menus.map((menu) => {
      const permissionMenu = Object.assign(new PermissionMenu(), {});
      permissionMenu.menu = menu;
      return permissionMenu;
    });

    const permissionABs = actionButtons.map((menu) => {
      const PermissionABItem = Object.assign(new PermissionAB(), {});
      PermissionABItem.actionButton = menu;
      return PermissionABItem;
    });

    await this.entityManager.save(PermissionMenu, permissionMenus);
    await this.entityManager.save(PermissionAB, permissionABs);

    // 然后存储到自己身上
    newPermission.permissionABs = permissionABs;
    newPermission.permissionMenus = permissionMenus;
    return await this.entityManager.save(Permission, newPermission);
  }

  async addPermission(permissionInfo: PermissionReqDTO) {
    const newPermission = new Permission();
    newPermission.name = permissionInfo.name;
    newPermission.description = permissionInfo.description;

    return await this.genratePermission(
      newPermission,
      permissionInfo.menus,
      permissionInfo.actionButtoins,
    );
  }

  async getAllPermission(pageInfo: PagenationReqDTO) {
    // 这个类似一个组Permission 组里面由许多东西 这里的查询 不连接表
    const res = await DoPagenation<Permission>(
      pageInfo,
      this.entityManager,
      Permission,
      {},
      {},
    );
    return res;
  }

  async getPermissionDetail(id: number) {
    const sqlRes = await this.entityManager.findOne(Permission, {
      where: { id: id },
      relations: {
        permissionABs: {
          actionButton: true,
        },
        permissionMenus: {
          menu: true,
        },
        rolePermissions: {
          roles: true,
        },
      },
    });

    // 进行map

    const menusMap = new Map();
    const menus = sqlRes.permissionMenus.reduce((prev, permissionMenu) => {
      const menu = permissionMenu.menu;
      if (!menusMap.has(menu.id)) {
        menusMap.set(menu.id, true);
        prev.push(menu);
      }
      return prev;
    }, []);

    const actionButtonMap = new Map();
    const actionButtons = sqlRes.permissionABs.reduce((prev, permissionABs) => {
      const actionButton = permissionABs.actionButton;
      if (actionButton && !actionButtonMap.has(actionButton.id)) {
        actionButtonMap.set(actionButton.id, true);
        prev.push(actionButton);
      }
      return prev;
    }, []);

    const rolesMap = new Map();
    const roles = sqlRes.rolePermissions.reduce((prev, rolePermissions) => {
      const roles = rolePermissions.roles;
      if (!rolesMap.has(roles.id)) {
        rolesMap.set(roles.id, true);
        prev.push(roles);
      }
      return prev;
    }, []);

    return {
      ...sqlRes,
      menus,
      actionButtons,
      roles,
    };
  }

  // update
  async updatePermission(permissionInfo: PermissionReqDTO) {
    const permission = await this.entityManager.findOne(Permission, {
      where: { id: permissionInfo.id },
      relations: {
        permissionABs: true,
        permissionMenus: true,
        rolePermissions: true,
      },
    });

    // 先删除 中间表 然后直接新加
    delete permission.permissionABs;
    delete permission.permissionMenus;
    delete permission.rolePermissions;
    await this.entityManager.save(Permission, permission);
    // 然后去新增
    permission.name = permissionInfo.name;
    permission.description = permissionInfo.description;

    return await this.genratePermission(
      permission,
      permissionInfo.menus,
      permissionInfo.actionButtoins,
    );
  }

  // delete
  async deletePermission(ids: number[]) {
    return this.entityManager.delete(Permission, ids);
  }
}
