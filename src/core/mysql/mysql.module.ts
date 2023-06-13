import { DynamicModule, Global, Inject, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZKModuleAsyncOptions } from '../types/zk.type';

// @Module({})
// export class ZKModule {
//   static forRootAsync(options:any): DynamicModule {

//     TypeOrmModule.forRootAsync({
//       useFactory: async (zkService: ZKService) => {
//         const { mysql } = await zkService.getConfig<any>('database');
//         return {
//           type: 'mysql',
//           host: mysql.host,
//           port: mysql.prot,
//           username: mysql.name,
//           password: mysql.pwd,
//           database: mysql.lib,
//           // entities: [resolve(__dirname, '../entities/**/*.entity{.ts,.js}')], // 扫描本项目中.entity.ts或者.entity.js的文件
//           synchronize: true,
//         };
//       },
//       inject: [ZKService],
//     }),

//     return {
//       module: ZKModule,
//     }
//   }
// }
