# Nest_IAM_System
> 这是一个 基于 NESTJS 的IAM 开源项目

重要说明！开源万岁🎉 ，本项目遵守 MIT 开源协议，请自觉并尊重开源事业，不要二次兜售！🙅

# V1.0
## TodoAndFeature

1. 重置整个项目工程架构
2. 迁移 CoreZk 模块
3. 迁移 CoreMysql 模块
4. 迁移 CoreRedis 模块
5. 迁移 CoreCache 模块
6. 迁移 Core统一Error Res 模块
6.1 重点！ typeOrm的 Res 统一和验证 - swagger 迁移
7. 迁移 CoreAuth 模块
7.1 迁移 CoreLog 模块

8. resource 业务
9. iam 业务
10. 例子 API1，API2
11. 例子 OSS 平台 // 思考🤔️ 这些个 中台 有存在的必要吗？
12. 例子 Mysql 平台
13. 例子 MQ 平台

14. 想办法重构一下zk 能够自动解析最新配置
15. 关于 TRPC/gRPC 的集成 办法 
15.1. 如何设计 Service-Client 和 业务 MicroService

### 迁移 CoreZk Log

zk 安装文档？(我用单机Docker)
https://www.cnblogs.com/LUA123/p/11428113.html

客户端安装文档？
https://github.com/vran-dev/PrettyZoo/releases

客户端安装失败怎么操作？
https://blog.csdn.net/Xurui_Luo/article/details/107908238

redis 安装教程
https://www.runoob.com/docker/docker-install-redis.html


config结构
```ts
type AuthInfo = {
  secret: string;
  expiresIn: string;
};

type ConfigDBType = {
  mysql: Array<ConfigDBMYSQL>;
  mongo?: any;
};

type ConfigDBMYSQL = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
};

type RedisConfig = {
  host: string;
  password: string;
  db: number;
  port: number;
  family: number;
};

type RESTAPI = {
  a: {
    b: {
      c: {
        d: {
          name: string;
        };
      };
    };
  };
};

type Config = {
  ResourceService: {
    Database: ConfigDBType;
    RESTAPI: RESTAPI;
    AuthInfo?: AuthInfo;
    RedisConfig?: RedisConfig;
  };
};

export { Config };

```

由于我们将公共能力剥离到了core中，所以我们把module的注册逻辑放到 core中，而是采取 谁用谁取的原则 比如 zkModule

获取值的时候注意了
```ts
// 默认获取的时候只获取 nodeName 不要获取里面具体的值
  getConfig = async <T>(path): Promise<T> => {
    
    const res = (await this.getData(path)) as any;
    return JSON.parse(res);
  };
```

现在你只需要这样使用就好了
```ts
this.zkService.getConfig('AuthInfo').then(v => {
      console.log(v);
    });

// 如果写错了名字或者zk/本地没配 会error 
// 配在 config/xx/settings.json 中 remote 远程 local 读本地代码
```

好了 ZK的迁移先这样，当然我们还有许多的 TODO: 没有做，后续再改

### 迁移 CoreMysql Log

所有的内容都不应该作为黑盒子，而是应该交给外部使用，所以我没必要对这个东西进行封装。直接用
```ts
 TypeOrmModule.forRootAsync({
      useFactory: async (zkService: ZKService) => {
        const config = await zkService.getConfig<ConfigDBMYSQL>('Database');
        const options: ConnectionOptions = {
          type: 'mysql',
          name: config.name,
          host: config.host,
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
          synchronize: config.synchronize,
        };
        return options;
      },
      inject: [ZKService],
    }),
```

注意db的用户 主机 名称应该是 % 而不是指定 ip哈！
```sql
CREATE USER `joney`@`%`; ✅

CREATE USER `joney`@`localhost`; 就是错的❌
```

在迁移的过程中发现实在是太多的魔法字符串了，需想办法归纳起来！@TODO:


### 迁移 CoreRedis 和 CoreCache Log

比较简单，这里介绍一个 直接覆盖实现又可以进行封装的方法

```ts
import { DynamicModule, Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule, RedisModuleAsyncOptions } from '@liaoliaots/nestjs-redis';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule extends RedisModule {
  static forRootAsync(
    options: RedisModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    return RedisModule.forRootAsync(options, isGlobal);
  }
}

```

说一个另外的问题，cache 和 redis 应该分开，redis 是一个产品可以实现高速缓存
cache 是一个基本能力。nest默认的cache是存内存的，在我的例子中我把他们存到内存中。

如果有需要我们可以把它换到redis中，一般对于企业来说 cache 是存 redis或者 kafaka 的 。但是这里就不这样处理了
@TODO: 存到另一个redis中做为 cache redis 

虽然nest提供的 cache module 可以直接用，但是我们企业运用实践中我们一般都会
自己额外封装一次

**下面的三个东西 应该和在一起讲 ！注意了有很强的关联性**

### 迁移 CoreLog 模块 Log
这个东西需要内敛到 core中 把需要配置的地方暴露出来就好了

涉及主题：如何二次封装 动态模块？
```ts
// 像这样使用
 LogModule.forRootAsync({
      useFactory: async (zkService: ZKService) => {
        // 这只是一个预留位置 无实际作用
        // const value = await zkService.getConfig('Database');
        // console.log(resolve(
        //   __dirname,
        //   '../../logs',
        //   'application-%DATE%.log',
        // ));
        return {
          xxx
          },
        };
      },
      inject: [ZKService],

// 封装方法 📦

@Module({})
export class LogModule extends WinstonModule {
  static forRootAsync(options: WinstonModuleAsyncOptions & any): DynamicModule {
    return WinstonModule.forRootAsync({
      useFactory: async (parmas: any) => {
        const config = await options.useFactory(parmas);
        const { console = {}, dailyRotateFile = {} } = config;
        return {
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike(console.systemName, {
                  colors: console.colors,
                  prettyPrint: console.prettyPrint,
                }),
              ),
            }),
            new DailyRotateFile({
              ...dailyRotateFile,
            }),
          ],
        };
      },
      inject: [...options.inject],
    });
  }
}

```


### 迁移 Core统一Error Res Log

下面的内容主要用到了 UseInterceptors Filter 和 自定义  decorators exception 这四种东西，相关的文章王已经发布说明过，这里不详细赘述了。

### 重点！ typeOrm的 Res 统一和验证 - swagger 迁移 Log

这里的重点是 对 UseInterceptors 的理解和运用，如果它用在 controller 上 那么在 数据出去的时候 会经过它 被转化。比如 classSerializerMysql.interceptor 和 httpReq.interceptor。详情见 文章：https://juejin.cn/post/7231870422391930940?searchId=20240507174121BC6C8AF138566897516B （序列化）

### 迁移 CoreAuth 模块 Log



@TODO: 收敛所有的 /lib/core 导出

### V2.0
> 把 V1.0 剩下的TODO:做完