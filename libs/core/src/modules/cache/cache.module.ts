import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  CacheModuleAsyncOptions,
  CacheModule as CacheModuleBase,
} from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule extends CacheModuleBase {
  static forRootAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return CacheModuleBase.registerAsync(options);
  }
}
