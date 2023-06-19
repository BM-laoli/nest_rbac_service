import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ZKService } from '../zk/zk.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: async (zkService: ZKService) => {
        const redis = await zkService.getConfig<RedisConfig>(
          '/RBAC_Service/RedisConfig',
        );
        return {
          config: {
            host: redis.host,
            port: redis.port,
            db: redis.db,
            family: redis.family,
            password: redis.password,
          },
        };
      },
      inject: [ZKService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
