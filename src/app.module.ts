import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './core/core.module';
import { User_db2 } from './entities/rbac_db_1/te2.entity';
import { TestModule } from './modules/test_module/test.module';
import { APP_GUARD } from '@nestjs/core';
import { NotAuthGuard } from './core/auth/NotAuthGuard.guard';

@Module({
  imports: [CoreModule, TestModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: NotAuthGuard,
    },
  ],
})
export class AppModule {}
