import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../../conf/configuration';
import { ZKModule } from './zk/zk.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZKService } from './zk/zk.service';
import { MysqlModule } from './mysql/mysql.module';
import { InitConfig } from '../../conf/configuration';
import { resolve } from 'path';
@Global()
@Module({
  imports: [
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
