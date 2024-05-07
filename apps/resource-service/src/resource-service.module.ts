import { Logger, Module } from '@nestjs/common';
import { ResourceServiceController } from './resource-service.controller';
import { ResourceServiceService } from './resource-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { ZKModule, ZKService } from '@app/core/modules';
import { Setting } from '@app/core/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigDBType, RedisConfig } from './types';
import { resolve } from 'path';
import { ConnectionOptions } from 'typeorm';
import { RedisModule } from '@app/core/modules/redis/redis.module';
import { RedisService } from '@app/core/modules/redis/redis.service';
import { CacheModule } from '@app/core/modules/cache/cache.module';
import { CacheService } from '@app/core/modules/cache/cache.service';
import { LogModule } from '@app/core/modules/log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // TODO: 写一个说明文档 部署的时候只需要把.env 替换内容就好了
        resolve('./apps/resource-service/.env'),
        resolve('./apps/resource-service/.env.production'),
        resolve('./apps/resource-service/.env.staging'),
      ],
      load: [() => config('resource-service')],
    }),
    ZKModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          zkHost: configService.get<Setting>('setting').hostname,
          localConfig: () => config('resource-service'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'sys_iam', // @TODO: 太多魔法字符串
      useFactory: async (zkService: ZKService) => {
        const config_res = await zkService.getConfig<ConfigDBType>('Database');
        const config = config_res.mysql_sys_iam;
        const options: ConnectionOptions = {
          type: 'mysql',
          // name: 'sys_iam', // 此name 非 上面的name 这是两个不一样的东西！
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          entities: [
            resolve(
              __dirname,
              `./entities/${config.name}/**/*.entity{.ts,.js}`,
            ),
          ], // 扫描本项目中.entity.ts或者.entity.js的文件
          synchronize: config.synchronize,
        };
        return options;
      },
      inject: [ZKService],
    }),
    RedisModule.forRootAsync({
      useFactory: async (zkService: ZKService) => {
        const config = await zkService.getConfig<RedisConfig>('RedisConfig');
        return {
          config: {
            host: config.host,
            port: config.port,
            password: config.password,
            db: config.db,
            family: config.family,
            onClientCreated: () => {
              Logger.log('Connet success....');
            },
          },
        };
      },
      inject: [ZKService],
    }),
    CacheModule.forRootAsync({
      useFactory: () => {
        return {
          ttl: 5, // seconds
          max: 10, // maximum number of items in cache
          isGlobal: true,
        };
      },
      inject: [ZKService],
    }),
    LogModule.forRootAsync({
      useFactory: async (zkService: ZKService) => {
        // 这只是一个预留位置 无实际作用
        // const value = await zkService.getConfig('Database');
        return {
          console: {
            systemName: 'IMA_RES',
            colors: true,
            prettyPrint: true,
          },
          dailyRotateFile: {
            filename: resolve(  // @TODO: 这个地方总是有一些问题
              __dirname,
              './apps/resource-service/logs',
              'application-%DATE%.log',
            ),
            dirname: 'logs',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
          },
        };
      },
      inject: [ZKService],
    }),
  ],
  controllers: [ResourceServiceController],
  providers: [ResourceServiceService, RedisService, CacheService],
})
export class ResourceServiceModule {}
