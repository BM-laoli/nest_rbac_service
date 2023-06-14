import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User_db1 } from 'src/entities/rbac_db/te1.entity';
import { User_db2 } from 'src/entities/rbac_db_1/te2.entity';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User_db1], 'rbac_db'),
    TypeOrmModule.forFeature([User_db2], 'rbac_db_1'),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
