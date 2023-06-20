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
import { comparePassword, encryptPassword } from '../utils/crypt';
import { log } from 'console';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
@Controller({
  path: '/auth',
  scope: Scope.REQUEST,
})
@SerializeOptions({
  enableImplicitConversion: false,
})
@UseInterceptors(ClassSerializerMysqlInterceptor)
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authUserService: AuthUserService,
  ) {}

  // 开始验证 注意由于 签名的 的实现原因，你这里必须传递 jwt 实现的东西 要不然会报错
  @NotAuth()
  @MysqlEntityClass(AuthInfoVO)
  @Post('/login')
  @ApiResponse({
    type: AuthInfoVO,
  })
  async login(@Body() loginParams: AuthLoginDTO) {
    return this.authService.loginSingToken(loginParams);
  }

  @NotAuth()
  @MysqlEntityClass(AuthInfoVO)
  @Post('/regestier')
  async register(@Body() userInfo: UserInfoDTO) {
    await this.authUserService.register(userInfo);

    return this.authService.loginSingToken({
      username: userInfo.username,
      password: userInfo.password,
    });
  }
}
