import {
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  isNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialIdDTO } from '../base.dto';
import { UserInfo } from 'src/entities/rbac_db/user-info.entity';
import { UserRole } from 'src/entities/rbac_db/user-role.entity';

// 注意 class UserInfoReqDTO extends   在swager
// 不能正确 使用 PartialType，但是直接extends PartialId 可以
// class UserInfoReqDTO extends PartialId {
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

class UpdateUserInfoReqDTO extends PartialIdDTO {
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

  // @ValidateNested()
  @ApiProperty()
  roles?: Array<number>;
}

class UserInfoReqDTO extends AuthLoginReqDTO {}

export { AuthLoginReqDTO, UpdateUserInfoReqDTO, UserInfoReqDTO };
