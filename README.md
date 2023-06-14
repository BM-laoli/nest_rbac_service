# 说明
>
> 这是基于NestJs的RBAC Service Demo ，也是一套 **标准切规范的Nestjs稳定**

# 重难点

## 动态模块的 参数传递

```ts
import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

interface MyModuleOptions {
  databases: string[];
  someDependency: any;
}

@Module({})
export class MyModule {
  static forRootAsync(optionsFactory: () => Promise<MyModuleOptions>): DynamicModule {
    return {
      module: MyModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
          name: 'default',
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const options: ConnectionOptions = {
              type: 'postgres',
              host: configService.get('db.host'),
              port: configService.get('db.port'),
              username: configService.get('db.username'),
              password: configService.get('db.password'),
              database: configService.get('db.database'),
              entities: [],
              synchronize: true,
            };
            return options;
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: MyModuleOptions,
          useFactory: optionsFactory,
          inject: [ConfigService],
        },
        ...optionsFactory().databases.map(db => ({
          provide: `DATABASE_${db.toUpperCase()}`,
          useFactory: async (configService: ConfigService) => {
            const options: ConnectionOptions = {
              type: 'postgres',
              host: configService.get(`db.${db}.host`),
              port: configService.get(`db.${db}.port`),
              username: configService.get(`db.${db}.username`),
              password: configService.get(`db.${db}.password`),
              database: configService.get(`db.${db}.database`),
              entities: [],
              synchronize: true,
            };
            return options;
          },
          inject: [ConfigService],
        })),
      ],
      exports: optionsFactory().databases.map(db => `DATABASE_${db.toUpperCase()}`),
    };
  }
}
```
