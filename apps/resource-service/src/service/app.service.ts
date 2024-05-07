import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { AppCreateReqDTO } from '../dto/request/r-s.dto';
import { App } from '../entities/sys_iam/app.entity';
import { DoPagenation } from '@app/core/utils/db';
import { PagenationReqDTO } from '@app/core/dto/requestBase.dto';

// CRDU
@Injectable()
export class AppService {
  constructor(
    @InjectDataSource('sys_iam')
    private dataSource: DataSource,
    @InjectEntityManager('sys_iam')
    private entityManager: EntityManager,
  ) {}

  async addApp(appInfo: AppCreateReqDTO) {
    // 直接 run sql
    const value = await this.entityManager.query(
      `
    INSERT INTO App (name,description,menu_ids)
      VALUES (
        ?,?,?
      );
    `,
      [appInfo.name, appInfo.description, appInfo.menu_ids],
    );
    return value;
  }

  async getAllApp(pageInfo: PagenationReqDTO) {
    const res = await DoPagenation<App>( // 注意这个地方是 entity 不是DTO
      pageInfo,
      this.entityManager,
      App,
      {},
      {},
    );
    return res;
  }

  // async updateACB(menuInfo: MenuCreateReqDTO) {}

  // async deleteACB(ids: number[]) {}
}
