import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getValue(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }
  async setValue(key: string, value: string, tt: number): Promise<any> {
    return this.cacheManager.set(key, value, tt);
  }
  async delValue(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }

  async reset(): Promise<any> {
    return this.cacheManager.reset();
  }
}
