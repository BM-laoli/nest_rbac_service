import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NotAuth } from '../decorators/notAuth.decorator';
import { encryptPassword } from '../utils/crypt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 开始验证 注意由于 签名的 的实现原因，你这里必须传递 jwt 实现的东西 要不然会报错
  @NotAuth()
  @Post('login')
  async login(@Body() loginParams: any) {
    const value = await this.authService.loginSingToken(loginParams);
    return value;
  }

  @NotAuth()
  @Get('noAuth')
  noAuth() {
    const value = encryptPassword('password123');
    return '66';
  }

  @Get('needAuth')
  needAuth() {
    return '66';
  }
}
