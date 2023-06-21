import { PartialType } from '@nestjs/mapped-types';
import { PagenationDTO, PartialId } from './base.dto';
import {
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  isNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserInfoDTO extends PartialType(PartialId) {
  @ApiProperty()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty()
  @IsEmail({})
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

class AuthLoginDTO {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

class UpdateUserInfoDTO extends PartialType(UserInfoDTO) {
  // @ValidateNested()
  roles?: Array<number>;
}

export { UserInfoDTO, AuthLoginDTO, PagenationDTO, UpdateUserInfoDTO };
