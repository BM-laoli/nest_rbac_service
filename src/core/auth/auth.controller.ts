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
import { MysqlEntityClass } from '../decorators/mysqlEntityClass.decorator';
import { ClassSerializerMysqlInterceptor } from '../interceptor/classSerializerMysql.interceptor';
import AuthUserService from './authUser.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthInfoResDTO } from 'src/dto/response/responseBase.dto';
import { AuthLoginReqDTO, UserInfoReqDTO } from 'src/dto/request/rbac.dto';
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
  @MysqlEntityClass(AuthInfoResDTO)
  @Post('/login')
  @ApiResponse({
    type: AuthInfoResDTO,
  })
  async login(@Body() loginParams: AuthLoginReqDTO) {
    return this.authService.loginSingToken(loginParams);
  }

  @NotAuth()
  @MysqlEntityClass(AuthInfoResDTO)
  @Post('/regestier')
  @ApiResponse({
    type: AuthInfoResDTO,
  })
  async register(@Body() userInfo: UserInfoReqDTO) {
    await this.authUserService.register(userInfo);
    return this.authService.loginSingToken({
      username: userInfo.username,
      password: userInfo.password,
    });
  }
}
