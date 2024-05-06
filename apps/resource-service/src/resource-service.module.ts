import { Module } from '@nestjs/common';
import { ResourceServiceController } from './resource-service.controller';
import { ResourceServiceService } from './resource-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { ZKModule, ZKService } from '@app/core/modules';
import { Setting } from '@app/core/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigDBType } from './types';
import { resolve } from 'path';
import { ConnectionOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
  controllers: [ResourceServiceController],
  providers: [ResourceServiceService],
})
export class ResourceServiceModule {}
