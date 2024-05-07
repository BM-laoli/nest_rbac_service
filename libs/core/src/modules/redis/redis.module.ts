import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import {
  RedisModule as RedisModuleBase,
  RedisModuleAsyncOptions,
} from '@liaoliaots/nestjs-redis';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule extends RedisModuleBase {
  static forRootAsync(
    options: RedisModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    return RedisModuleBase.forRootAsync(options, isGlobal);
  }
}
