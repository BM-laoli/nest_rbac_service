import { Inject, Injectable } from '@nestjs/common';
import { ZOOKEEPER_CLIENT } from '../../constant';
import { ZKLocalConfig } from './zk-core.module';
import { ConfigService } from '@nestjs/config';
import { Setting } from '@app/core/types';

@Injectable()
export class ZKService {
  // TODO: 缓存 不要总是fetch 到zk
  // TODO: 监听 zk 的更新 自主同步缓存
  private readonly localConfig: Record<string, any>;
  private readonly rootPath: string;

  constructor(
    @Inject(ZOOKEEPER_CLIENT)
    private readonly client: typeof ZKLocalConfig,
    private readonly configService: ConfigService,
  ) {
    // local 的就不要去请求 zk了
    this.localConfig = this.configService.get<any>('localValue');
    this.rootPath = this.configService.get<Setting>('setting').rootNode;
  }

  getChildren = (path) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.client.getChildren(path, (error, children, stat) => {
        if (error) {
          reject(error);
        } else {
          resolve((children || []).sort());
        }
      });
    });
  };

  getData = (path) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.client.getData(path, (error, data, stat) => {
        if (error) {
          reject(error);
        } else {
          resolve(data ? data.toString() : '');
        }
      });
    });
  };

  // 默认获取的时候只获取 nodeName 不要获取里面具体的值
  // TODO:兼容其他的数据格式 XML JSON RAW
  getConfig = async <T>(path): Promise<T> => {
    if (this.localConfig[path]) {
      return this.localConfig[path];
    }
    // log(`/${this.rootPath}/${path}.json`)
    const res = (await this.getData(`/${this.rootPath}/${path}.json`)) as any;
    return JSON.parse(res);
  };
}
