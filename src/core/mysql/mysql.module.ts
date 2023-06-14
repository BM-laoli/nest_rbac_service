import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlModuleAsyncOptions } from '../types/mysql.type';
import { MYSQL_MODULE_OPTIONS } from '../constans/mysql';
import { ZKService } from '../zk/zk.service';
import { resolve } from 'path';

@Module({})
export class MysqlModule {
  static forRootAsync(options: MysqlModuleAsyncOptions): DynamicModule {
    const DBName = options.dbs;

    const imports = DBName.map((db) =>
      TypeOrmModule.forRootAsync({
        name: db,
        useFactory: async (zkService: ZKService) => {
          const DBConfigAll = await zkService.getConfig<
            Array<ConfigDBMYSQLType>
          >('/RBAC_Service/database/mysql');

          const DBConfig = DBConfigAll.find((item) => item.name === db);
          const options: ConnectionOptions = {
            type: 'mysql',
            name: DBConfig.name,
            host: DBConfig.host,
            port: DBConfig.port,
            username: DBConfig.username,
            password: DBConfig.password,
            database: DBConfig.database,
            entities: [
              resolve(
                __dirname,
                `../../entities/${DBConfig.name}/**/*.entity{.ts,.js}`,
              ),
            ], // 扫描本项目中.entity.ts或者.entity.js的文件
            synchronize: true,
          };
          return options;
        },
        inject: [ZKService],
      }),
    );

    return {
      module: MysqlModule,
      imports: [...imports],
    };
  }
}
