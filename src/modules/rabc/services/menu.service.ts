import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { MenuCreateReqDTO } from 'src/dto/request/rbac.dto';
import { Menu } from 'src/entities/rbac_db/menu.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export default class MenuService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  async addMenu(menuInfo: MenuCreateReqDTO) {
    const menu = Object.assign(new Menu(), menuInfo);
    if (menuInfo.parentMenuID) {
      const parentMenu = await this.entityManager.findOne(Menu, {
        where: {
          id: menuInfo.parentMenuID,
        },
      });
      menu.parentMenu = parentMenu;
    }
    return this.entityManager.save(Menu, menu);
  }

  async getAllMenus(praentId?: number) {
    if (!praentId) {
      return await this.entityManager.getTreeRepository(Menu).findRoots();
    }

    const findPraentMenu = await this.entityManager.findOne(Menu, {
      where: { id: praentId },
      relations: ['childMenus'],
    });
    const findRes = await this.entityManager
      .getTreeRepository(Menu)
      .findDescendantsTree(findPraentMenu);
    return findRes;
  }

  async updateACB(menuInfo: MenuCreateReqDTO) {
    return this.entityManager.update(Menu, { id: menuInfo.id }, menuInfo);
  }

  async deleteACB(ids: number[]) {
    return this.entityManager.delete(Menu, ids);
  }
}
