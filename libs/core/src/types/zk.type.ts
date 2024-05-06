import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export type ZkConfigModuleOptions = {
  zkHost: string;
  localConfig?: any;
};

interface ZKModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<any>;
  useClass?: Type<any>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ZkConfigModuleOptions> | ZkConfigModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export { ZKModuleAsyncOptions };
