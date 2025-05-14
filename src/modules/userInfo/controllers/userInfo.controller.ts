// 实现 userInfo 的 controller
import { Controller, Get, Scope, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { PagenationWrapResDTO } from 'src/dto/response/responseBase.dto';
import { UserDetailResDTO } from 'src/dto/response/rbac.dto';
import { ClassSerializerMysqlInterceptor } from 'src/core/interceptor/classSerializerMysql.interceptor';
import { UserInfoService } from '../services/userInfo.service';

@Controller({
  path: '/user',
  scope: Scope.REQUEST,
})
@ApiExtraModels(PagenationWrapResDTO, UserDetailResDTO)
@ApiTags('user')
@SerializeOptions({
  enableImplicitConversion: false,
})
@ApiBearerAuth()
@UseInterceptors(ClassSerializerMysqlInterceptor)
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  // 写一个测试代码 
  @Get('test')
  test() {
    return this.userInfoService.getUserInfo();
  }
}