import { ApiProperty } from '@nestjs/swagger';

class PartialIdDTO {
  @ApiProperty({
    required: false,
  })
  id?: number;
}
export { PartialIdDTO };
