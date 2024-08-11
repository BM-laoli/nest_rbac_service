import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

class PagenationReqDTO {
  @ApiProperty()
  @IsNotEmpty()
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  pageSize: number;

  @ApiProperty({
    required: false,
  })
  total: number;
}

// 注意 class UserInfoReqDTO extends   在swager
// 不能正确 使用 PartialType，但是直接extends PartialId 可以
// class UserInfoReqDTO extends PartialId {
class PartialIdDTO {
  @ApiProperty({
    required: false,
  })
  id?: number;
}
class AuthLoginReqDTO extends PartialIdDTO {
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

class UserInfoReqDTO extends AuthLoginReqDTO {}

export { PagenationReqDTO, AuthLoginReqDTO, UserInfoReqDTO };
