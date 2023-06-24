import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CacheService } from '../cache/cache.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ZKService } from '../zk/zk.service';
import AuthUserService from './authUser.service';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (zkService: ZKService) => {
        const auth = await zkService.getConfig<AuthInfo>(
          '/RBAC_Service/AuthInfo',
        );
        return {
          secret: auth.secret,
          global: true,
          signOptions: { expiresIn: auth.expiresIn },
        };
      },
      inject: [ZKService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthUserService, AuthService, JwtStrategy, CacheService],
  exports: [AuthService, AuthUserService],
})
export class AuthModule {}
