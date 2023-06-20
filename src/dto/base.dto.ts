import { IsNotEmpty } from 'class-validator';

class PartialId {
  id: number;
}

class PagenationDTO {
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  pageSize: number;

  @IsNotEmpty()
  total: number;
}

export { PartialId, PagenationDTO };
