import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ZKService } from '../zk/zk.service';
// import { CacheService } from '../cache/cache.service';
import { AuthInfo } from '@app/core/types';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE)
    private readonly cacheService: Redis,
    private readonly zkService: ZKService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKeyProvider: (req, rawJWT, done) => {
        zkService.getConfig<AuthInfo>('AuthInfo').then((res) => {
          done(null, res.secret);
        });
      },
    });
  }

  // JWT验证 - Step 4: 被守卫调用
  async validate(req: Request, payload: any) {
    //  注意 只有通过前面默认的加密验证之后才能进入
    console.log('JWT -----', req.headers);
    const originToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    // 只有验证通过之后才会来到这里
    // console.log(`JWT验证 - Step 4: 被守卫调用`);
    // 这是一个string (我们重构了 cacheService 由原来的 jsonStringfy 变成了直接值 )
    const cacheToken = await this.cacheService.get(
      `user-token-${payload.sub}-${payload.username}`,
    );

    //单点登陆验证
    if (cacheToken !== originToken) {
      throw new UnauthorizedException('您账户已经在另一处登陆，请重新登陆');
    }

    return {
      username: payload.username,
    };
  }
}
