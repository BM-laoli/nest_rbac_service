import {
  Body,
  Controller,
  Post,
  Scope,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public.decorator';
import { MysqlEntityClass } from '../../decorators/mysqlEntityClass.decorator';
import { ClassSerializerMysqlInterceptor } from '../../interceptor/classSerializerMysql.interceptor';
import AuthUserService from './authUser.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthInfoResDTO } from '@app/core/dto/responseBase.dto';
import { AuthLoginReqDTO, UserInfoReqDTO } from '@app/core/dto/requestBase.dto';

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
  @Public()
  @MysqlEntityClass(AuthInfoResDTO)
  @Post('/login')
  @ApiResponse({
    type: AuthInfoResDTO,
  })
  async login(@Body() loginParams: AuthLoginReqDTO) {
    console.log('error', loginParams);
    return this.authService.loginSingToken(loginParams);
  }

  @Public()
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
