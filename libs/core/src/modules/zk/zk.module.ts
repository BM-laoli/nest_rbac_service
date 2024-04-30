import { DynamicModule, Module } from '@nestjs/common';
import { ZKModuleAsyncOptions } from '../../types';
import { ZKCoreModule } from './zk-core.module';

@Module({})
export class ZKModule {
  static forRootAsync(options: ZKModuleAsyncOptions): DynamicModule {
    return {
      module: ZKCoreModule,
      imports: [ZKCoreModule.forRootAsync(options)],
    };
  }
}
