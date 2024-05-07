import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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

export { PagenationResDTO, PagenationWrapResDTO };
