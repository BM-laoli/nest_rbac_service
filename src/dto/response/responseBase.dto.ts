import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserInfoResDTO } from './rbac.dto';

class AuthInfoResDTO {
  @ApiProperty({
    description: 'token',
  })
  @Expose()
  public token: string;

  @Expose()
  @Type(() => UserInfoResDTO)
  @ApiProperty({
    type: UserInfoResDTO,
  })
  userInfo: UserInfoResDTO;

  constructor(partial: Partial<AuthInfoResDTO>) {
    Object.assign(this, partial);
  }
}

class PagenationResDTO {
  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  pageSize: number;

  @ApiProperty()
  @Expose()
  total?: number;

  constructor(partial: Partial<PagenationResDTO>) {
    Object.assign(this, partial);
  }
}

class PagenationWrapResDTO<T> {
  @ApiProperty()
  pageInfo: PagenationResDTO;

  // @Type( () => T) 泛型暂时无法使用
  @ApiProperty()
  list: T[];
}

export { AuthInfoResDTO, PagenationResDTO, PagenationWrapResDTO };
