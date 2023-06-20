import { Expose } from 'class-transformer';

class PagenationVO {
  @Expose()
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  total?: number;

  constructor(partial: Partial<PagenationVO>) {
    Object.assign(this, partial);
  }
}

export { PagenationVO };
