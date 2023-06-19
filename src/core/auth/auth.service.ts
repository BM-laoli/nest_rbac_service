// src/logical/auth/auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../utils/crypt';
import { CacheService } from '../cache/cache.service';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import AuthUserService from './authUser.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: AuthUserService,
    private readonly jwtService: JwtService,
    private readonly CacheService: CacheService,
  ) {}

  async loginSingToken(loginParams: any) {
    const authResult = await this.validateUser(
      loginParams.username,
      loginParams.password,
    );
    switch (authResult.code) {
      case 1:
        return this.certificate(authResult.user);
      case 2:
        this.sendError('账号或密码不正确');
      default:
        this.sendError('查无此人');
    }
  }

  // JWT验证 - Step 2: 校验用户信息
  async validateUser(
    username: string,
    password: string,
  ): Promise<{ code: number; user: UserInfo | undefined }> {
    // console.log('JWT验证 - Step 2: 校验用户信息');
    const user = await this.userService.findOne({
      username: username,
    });

    if (user) {
      // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
      const isOk = comparePassword(password, user.password);
      if (isOk) {
        // 密码正确
        return {
          code: 1,
          user,
        };
      } else {
        // 密码错误
        return {
          code: 2,
          user: null,
        };
      }
    }
    // 查无此人
    return {
      code: 401,
      user: null,
    };
  }

  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(user: UserInfo) {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    console.log('JWT验证 - Step 3: 处理 jwt 签证');
    try {
      const token = this.jwtService.sign(payload);
      // 把token存储到redis中，如果这个用户下次还登录就把这个值更新了，载validate的时候看看能不能
      // 找到原来的key的值没有就说明更新了就强制要求用户下线 于是这单点登录功能就完成了  ,过期时间和token一致
      await this.CacheService.set(
        `user-token-${user.id}-${user.username}`,
        token,
        60 * 60 * 8,
      );

      const userInfo = await this.userService.findOne({
        id: user.id,
      });
      return {
        token,
        userInfo: userInfo,
      };
    } catch (error) {
      return this.sendError('500');
    }
  }

  sendError(message: string) {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: message,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
