import { PartialType } from '@nestjs/mapped-types';
import { PartialId } from './base.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

class UserInfoDTO extends PartialType(PartialId) {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsEmail({})
  email: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

class AuthLoginDTO {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

export { UserInfoDTO, AuthLoginDTO };
