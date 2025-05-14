// 用户信息模块 
import { Module } from '@nestjs/common';
import { UserInfoService } from './services/userInfo.service';
import { UserInfoController } from './controllers/userInfo.controller';

@Module({
  imports:[],
  controllers: [UserInfoController],
  providers: [UserInfoService]
})
export class UserInfoModule {}
