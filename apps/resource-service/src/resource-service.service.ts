import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { App } from './entities/sys_iam/app.entity';

@Injectable()
export class ResourceServiceService {
  constructor(
    // 使用这两个会更加的灵活操作 DB
    @InjectDataSource('sys_iam')
    private dataSource: DataSource,
    @InjectEntityManager('sys_iam')
    private entityManager: EntityManager,
  ) {}
  getHello(): any {
    return this.entityManager.find(App);
  }
}
