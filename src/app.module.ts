import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { CoreModule } from './core/core.module';
import { NotAuthGuard } from './core/auth/NotAuthGuard.guard';
import { UserInfoModule } from './modules/userInfo/userInfo.module';

@Module({
  imports: [CoreModule,UserInfoModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: NotAuthGuard,
    },
  ],
})
export class AppModule {}
