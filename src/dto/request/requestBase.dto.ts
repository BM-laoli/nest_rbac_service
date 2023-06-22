import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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

export { PagenationReqDTO };
