import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { CacheService } from '../cache/cache.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ZKService } from '../zk/zk.service';
import AuthUserService from './authUser.service';
import { AuthInfo } from '@app/core/types';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (zkService: ZKService) => {
        const auth = await zkService.getConfig<AuthInfo>('AuthInfo');
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
  providers: [AuthUserService, AuthService, JwtStrategy],
  exports: [AuthService, AuthUserService],
})
export class AuthModule {}
