import { Injectable } from '@nestjs/common';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
// 封装我们使用的 redis 可以更方便管理
@Injectable()
export class CacheService {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE)
    private readonly redis: Redis,
  ) {}

  // 封装设置redis缓存的方法
  public async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!seconds) {
      await this.redis.set(key, value);
    } else {
      await this.redis.set(key, value, 'EX', seconds);
    }
  }

  // 设置获取redis缓存中的值
  public async get(key: string): Promise<any> {
    const data = await this.redis.get(key);
    if (data) return data;
    return null;
  }

  // 根据key删除redis缓存数据
  public async del(key: string): Promise<any> {
    return await this.redis.del(key);
  }

  // 清空redis的缓存
  public async flushall(): Promise<any> {
    return await this.redis.flushall();
  }
}
