import { Module } from '@nestjs/common';
import { ResourceServiceController } from './resource-service.controller';
import { ResourceServiceService } from './resource-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { ZKModule, ZKService } from '@app/core/modules';
import { Setting } from '@app/core/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigDBMYSQL } from './types';
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
      useFactory: async (zkService: ZKService) => {
        const config = await zkService.getConfig<ConfigDBMYSQL>('Database');
        console.log('config', config);
        const options: ConnectionOptions = {
          type: 'mysql',
          name: config.name,
          host: '127.0.0.1',
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          entities: [
            // resolve(
            //   __dirname,
            //   `../../entities/${config.name}/**/*.entity{.ts,.js}`,
            // ),
          ], // 扫描本项目中.entity.ts或者.entity.js的文件
          synchronize: true,
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
