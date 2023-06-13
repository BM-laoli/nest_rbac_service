import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InitConfig } from 'conf/configuration';
import { config } from '../../conf/configuration';
import { ZKModule } from './zk/zk.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZKService } from './zk/zk.service';
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
    // TypeOrmModule.forRootAsync({
    //   useFactory: async (zkService: ZKService) => {
    //     const { mysql } = await zkService.getConfig<any>('database');
    //     return {
    //       type: 'mysql',
    //       host: mysql.host,
    //       port: mysql.prot,
    //       username: mysql.name,
    //       password: mysql.pwd,
    //       database: mysql.lib,
    //       // entities: [resolve(__dirname, '../entities/**/*.entity{.ts,.js}')], // 扫描本项目中.entity.ts或者.entity.js的文件
    //       synchronize: true,
    //     };
    //   },
    //   inject: [ZKService],
    // }),
  ],
  providers: [],
})
export class CoreModule {}
