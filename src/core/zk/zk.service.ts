import { Inject, Injectable } from '@nestjs/common';
import { ZOOKEEPER_CLIENT } from '../constans/zk';
import { ZKLocalConfig } from './zk-core.module';

@Injectable()
export class ZKService {
  constructor(
    @Inject(ZOOKEEPER_CLIENT)
    private readonly client: typeof ZKLocalConfig,
  ) {}

  getChildren = (path) => {
    return new Promise((resolve, reject) => {
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
      this.client.getData(path, (error, data, stat) => {
        if (error) {
          reject(error);
        } else {
          resolve(data ? data.toString() : '');
        }
      });
    });
  };

  getConfig = async <T>(path): Promise<T> => {
    const res = (await this.getData(path)) as any;
    return JSON.parse(res);
  };
}
