import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './core/core.module';
import { User_db2 } from './entities/rbac_db_1/te2.entity';
import { TestModule } from './modules/test_module/test.module';

@Module({
  imports: [CoreModule, TestModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
