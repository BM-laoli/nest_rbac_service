import {
  Body,
  Controller,
  Post,
  Scope,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NotAuth } from '../decorators/notAuth.decorator';
import { AuthLoginDTO, UserInfoDTO } from 'src/dto/userInfo.dto';
import { MysqlEntityClass } from '../decorators/mysqlEntityClass.decorator';
import { AuthInfoVO } from 'src/vo/auth.vo';
import { ClassSerializerMysqlInterceptor } from '../interceptor/classSerializerMysql.interceptor';
import AuthUserService from './authUser.service';

@Controller({
  path: '/auth',
  scope: Scope.REQUEST,
})
@SerializeOptions({
  enableImplicitConversion: false,
})
@UseInterceptors(ClassSerializerMysqlInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private authUserService: AuthUserService,
  ) {}

  // 开始验证 注意由于 签名的 的实现原因，你这里必须传递 jwt 实现的东西 要不然会报错
  @NotAuth()
  @MysqlEntityClass(AuthInfoVO)
  @Post('/login')
  async login(@Body() loginParams: AuthLoginDTO) {
    return this.authService.loginSingToken(loginParams);
  }

  @NotAuth()
  @MysqlEntityClass(AuthInfoVO)
  @Post('/regestier')
  register(@Body() userInfo: UserInfoDTO) {
    return this.authUserService.register(userInfo);
  }
}
