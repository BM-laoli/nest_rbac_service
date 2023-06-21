import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class PartialId {
  @ApiProperty()
  id: number;
}

class PagenationDTO {
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

export { PartialId, PagenationDTO };
