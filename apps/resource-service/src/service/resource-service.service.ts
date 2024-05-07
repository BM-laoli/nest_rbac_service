import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { App } from '../entities/sys_iam/app.entity';
import { ZKService } from '@app/core/modules';
import { RedisService } from '@app/core/modules/redis/redis.service';
import { CacheService } from '@app/core/modules/cache/cache.service';

@Injectable()
export class ResourceServiceService {
  constructor(
    // 使用这两个会更加的灵活操作 DB
    @InjectDataSource('sys_iam')
    private dataSource: DataSource,
    @InjectEntityManager('sys_iam')
    private entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly cacheService: CacheService,
    private readonly zkService: ZKService,
  ) {
    this.redisService.set('hello', '00000000000000');
  }
  async getHello() {
    const data = await this.redisService.get('hello');
    console.log(data);
    return this.entityManager.find(App);
  }
}
