import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DoPagenation } from 'src/core/utils/pagenation';
import { UpdateAndCreateRoleInfoReqDTO } from 'src/dto/request/rbac.dto';
import { PagenationReqDTO } from 'src/dto/request/requestBase.dto';
import { ActionButton } from 'src/entities/rbac_db/action-button.entity';
import { Menu } from 'src/entities/rbac_db/menu.entity';
import { PermissionAB } from 'src/entities/rbac_db/permission-ab.entity';
import { PermissionMenu } from 'src/entities/rbac_db/permission-menu.entity';
import { Permission } from 'src/entities/rbac_db/permission.entity';
import { RoleInfo } from 'src/entities/rbac_db/role-info.entity';
import { RolePermission } from 'src/entities/rbac_db/role-permission.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export default class RoleService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  async generateRolePermission(roleInfo: RoleInfo, permissionIds: number[]) {
    // 先创建 RoleInfo 实体
    const permission = await this.entityManager.findByIds(
      Permission,
      permissionIds,
    );

    const newRole = await this.entityManager.save(roleInfo);

    const rolePermission = permission.map((permission) => {
      const rolePermission = new RolePermission();
      rolePermission.permission = permission;
      rolePermission.roles = roleInfo;
      rolePermission.permission_id = permission?.id;
      rolePermission.role_id = newRole?.id;
      return rolePermission;
    });

    await this.entityManager.save(rolePermission);
    newRole.rolePermissions = rolePermission;
    await this.entityManager.save(newRole);
    return this.getRoleDetail(newRole.id);
  }
  async getAllRoles(pageInfo: PagenationReqDTO) {
    const res = await DoPagenation<RoleInfo>(
      pageInfo,
      this.entityManager,
      RoleInfo,
      {},
      {},
    );
    return res;
  }

  async getRoleDetail(id: number) {
    const sqlRes = await this.entityManager.findOne(RoleInfo, {
      where: { id: id },
      relations: {
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
    });

    const menusMap = new Map();
    const menus = sqlRes.rolePermissions.reduce((prev, rolePermissions) => {
      const permission = rolePermissions.permission;
      const permissionMenus = permission.permissionMenus;
      permissionMenus.forEach((permissionMenu) => {
        const menu = permissionMenu.menu;
        if (!menusMap.has(menu.id)) {
          menusMap.set(menu.id, true);
          prev.push(menu);
        }
      });
      return prev;
    }, []);

    const actionButtonMap = new Map();
    const actionButtons = sqlRes.rolePermissions.reduce(
      (prev, rolePermissions) => {
        const permission = rolePermissions.permission;
        const permissionABs = permission.permissionABs;
        permissionABs?.forEach((permissionMenu) => {
          const actionButton = permissionMenu.actionButton;
          if (actionButton && !actionButtonMap.has(actionButton.id)) {
            actionButtonMap.set(actionButton.id, true);
            prev.push(actionButton);
          }
        });
        return prev;
      },
      [],
    );

    return {
      ...sqlRes,
      menus,
      actionButtons,
    };
  }

  async addRole(role: UpdateAndCreateRoleInfoReqDTO) {
    // 先创建 RoleInfo 实体
    const roleInfo = Object.assign(new RoleInfo(), role);
    return this.generateRolePermission(roleInfo, role.permissionIds);
  }

  async updateRole(role: UpdateAndCreateRoleInfoReqDTO) {
    // 删除原来的permission
    const roleInfo = await this.entityManager.findOne(RoleInfo, {
      where: { id: role.id },
      relations: ['rolePermissions'],
    });

    delete roleInfo.rolePermissions;
    roleInfo.name = role.name;
    roleInfo.description = role.description;
    // roleInfo.userRoles
    await this.entityManager.save(roleInfo);

    return this.generateRolePermission(roleInfo, role.permissionIds);
  }

  async deleteRole(ids: number[]) {
    return this.entityManager.delete(RoleInfo, ids);
  }
}
