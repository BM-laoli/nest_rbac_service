import { DynamicModule, Module } from '@nestjs/common';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
  WinstonModuleAsyncOptions,
} from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

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
