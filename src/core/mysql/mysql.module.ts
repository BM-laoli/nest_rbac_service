import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { resolve } from 'path';
import { MysqlModuleAsyncOptions } from '../types/mysql.type';
import { ZKService } from '../zk/zk.service';

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

          const DBConfig = DBConfigAll
            .filter(item => !item.name.startsWith('_')) // 过滤掉以下划线开头的数据库
            .find((item) => item.name === db);
          // 排除掉 
          
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
            synchronize: false,
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
