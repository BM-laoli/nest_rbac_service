import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

class PartialIdDTO {
  @ApiProperty({
    required: false,
  })
  id?: number;
}
export { PartialIdDTO };
