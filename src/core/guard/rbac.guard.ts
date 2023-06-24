import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/rbac.decorator';
import AuthUserService from '../auth/authUser.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authUserService: AuthUserService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1.通过反射获取到装饰器的权限
    // getAllAndOverride读取路由上的metadata getAllAndMerge合并路由上的metadata
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2.获取req拿到鉴权后的用户数据
    const req = context.switchToHttp().getRequest();
    const userTokenInfo = this.authService.decodeToken(
      req.headers.authorization.replace(/Bearer /, ''),
    );

    // 3.通过用户数据从数据查询权限
    const userInfo = await this.authUserService.findOne({
      username: userTokenInfo.username,
      id: userTokenInfo.sub,
    });
    const roles = userInfo.roles.map((item) => item.name);

    // 4.判断用户权限是否为装饰器的权限 的some返回boolean
    const flage = roles.some((role) => requireRoles.includes(role as any));
    return flage;
  }
}
