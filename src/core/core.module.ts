import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../../conf/configuration';
import { ZKModule } from './zk/zk.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZKService } from './zk/zk.service';
import { MysqlModule } from './mysql/mysql.module';
import { InitConfig } from '../../conf/configuration';
import { resolve } from 'path';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('RBAC_Service', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new DailyRotateFile({
          filename: resolve(__dirname, '../../logs', 'application-%DATE%.log'),
          dirname: 'logs',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [InitConfig],
    }),
    ZKModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          env: configService.get<any>('env'),
          zkHost: configService.get<any>('zkHost'),
          localConfig: config,
        };
      },
      inject: [ConfigService],
    }),
    MysqlModule.forRootAsync({
      dbs: InitConfig().mysqlDBS,
    }),
    // TypeOrmModule.forRootAsync({
    //   name: 'rbac_db',
    //   useFactory: async (zkService: ZKService) => {
    //     const DBConfigAll = await zkService.getConfig<Array<ConfigDBMYSQLType>>(
    //       '/RBAC_Service/database/mysql',
    //     );

    //     return {
    //       type: 'mysql',
    //       name: DBConfigAll[0].name,
    //       host: DBConfigAll[0].host,
    //       port: DBConfigAll[0].port,
    //       username: DBConfigAll[0].username,
    //       password: DBConfigAll[0].password,
    //       database: DBConfigAll[0].database,
    //       entities: [
    //         resolve(__dirname, '../entities/rbac_db/**/*.entity{.ts,.js}'),
    //       ], // 扫描本项目中.entity.ts或者.entity.js的文件
    //       synchronize: true,
    //     };
    //   },
    //   inject: [ZKService],
    // }),
  ],
  providers: [],
})
export class CoreModule {}
