import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, Transform, plainToInstance } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
class PagenationVO {
  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  pageSize: number;

  @ApiProperty()
  @Expose()
  total?: number;

  constructor(partial: Partial<PagenationVO>) {
    Object.assign(this, partial);
  }
}

class PagenationWrapVO<T> {
  @ApiProperty()
  pageInfo: PagenationVO;

  // @Type( () => T) 泛型暂时无法使用
  @ApiProperty()
  list: T[];
}
export { PagenationVO, PagenationWrapVO };
