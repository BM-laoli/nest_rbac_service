import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import { ZKService } from './zk.service';
import { ZOOKEEPER_CLIENT, ZOOKEEPER_MODULE_OPTIONS } from '../constans/zk';
import * as zookeeper from 'node-zookeeper-client';
import { ZKModuleAsyncOptions } from '../types/zk.type';
import { get } from 'lodash';

@Global()
@Module({})
export class ZKCoreModule implements OnModuleDestroy {
  private static zookeeperClient;

  private static createAsyncOptionsProvider(
    options: ZKModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: ZOOKEEPER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
  }

  static forRootAsync(options: ZKModuleAsyncOptions): DynamicModule {
    const asyncProviders = ZKCoreModule.createAsyncOptionsProvider(options);
    return {
      module: ZKCoreModule,
      imports: options.imports,
      providers: [asyncProviders, this.createClient(), ZKService],
      exports: [ZKService],
    };
  }

  onModuleDestroy() {
    ZKCoreModule.zookeeperClient.close();
  }

  private static createClient = (): Provider => ({
    provide: ZOOKEEPER_CLIENT,
    useFactory: async (moduleOptions: any) => {
      const config = moduleOptions;

      const getClient = async (options: any) => {
        const { url, ...opt } = options;
        // remote 时的配置
        ZKCoreModule.zookeeperClient = zookeeper.createClient(url, opt);
        ZKCoreModule.zookeeperClient.once('connected', () => {
          Logger.verbose('zk connected success...');
        });

        ZKCoreModule.zookeeperClient.on('state', (state: string) => {
          const sessionId = ZKCoreModule.zookeeperClient
            .getSessionId()
            .toString('hex');
        });

        ZKCoreModule.zookeeperClient.connect();
        return ZKCoreModule.zookeeperClient;
      };

      // 如果是 dev 请使用本地配置文件
      if (config.env === 'DEV') {
        ZKLocalConfig.localConfig = config.localConfig;
        return ZKLocalConfig;
      }

      // remote 时的配置
      ZKCoreModule.zookeeperClient = await getClient({
        url: config.zkHost,
      });

      return ZKCoreModule.zookeeperClient;
    },
    inject: [ZOOKEEPER_MODULE_OPTIONS],
  });
}

class ZKLocalConfig {
  static localConfig: any;

  static getChildren(
    path: any,
    cb: (e: any, res?: any, status?: any) => void,
  ): void {
    const keys = (path.split('/') as Array<string>).filter((it) => it);
    const LocalConfig = get(this.localConfig, keys, undefined);
    cb(null, JSON.stringify(LocalConfig));
  }

  static getData(
    path: any,
    cb: (e?: any, res?: any, status?: any) => void,
  ): void {
    const keys = (path.split('/') as Array<string>).filter((it) => it);
    const LocalConfig = get(this.localConfig, keys, undefined);
    cb(null, JSON.stringify(LocalConfig));
  }
}

export { ZKLocalConfig };
