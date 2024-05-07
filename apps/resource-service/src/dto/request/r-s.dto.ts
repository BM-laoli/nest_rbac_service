import { ApiProperty } from '@nestjs/swagger';
import { PartialIdDTO } from '../base.dto';
import { IsNotEmpty } from 'class-validator';

class MenuReqDTO extends PartialIdDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false, type: Number })
  type: number;

  @ApiProperty({ required: false, type: String })
  children_ids: string;

  @ApiProperty()
  parent_id: string;
}

class AppCreateReqDTO extends PartialIdDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  menu_ids: string;

  create_time?: Date;
  update_time?: Date;
}

export { AppCreateReqDTO, MenuReqDTO };
