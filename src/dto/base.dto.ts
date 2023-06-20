import { IsNotEmpty } from 'class-validator';

class PartialId {
  id: string;
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
