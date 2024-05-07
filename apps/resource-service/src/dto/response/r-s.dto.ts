import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Menu } from '../../entities/sys_iam/menu.entity';
import { App } from '../../entities/sys_iam/app.entity';
import { PagenationResDTO } from '@app/core/dto/responseBase.dto';

class MenuResDTO implements Menu {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  childrens: Menu[];

  @ApiProperty()
  @Expose()
  parent: Menu;

  @Exclude()
  children_ids: string;

  @Exclude()
  parent_id: number;

  @Expose()
  @ApiProperty()
  create_time: Date;

  @Expose()
  @ApiProperty()
  update_time: Date;

  constructor(partial: Partial<AppResDTO>) {
    Object.assign(this, partial);
  }
}

class AppResDTO implements App {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  // @Exclude()
  menu_ids: string;

  @Exclude() // class class-transformer 的标识用来统一格式化db返回
  // 需要联合 ClassSerializerMysqlInterceptor 一起使用
  // @Expose()
  // @ApiProperty()
  parentMenu: MenuResDTO;

  @Expose()
  @ApiProperty()
  create_time: Date;

  @Expose()
  @ApiProperty()
  update_time: Date;

  constructor(partial: Partial<AppResDTO>) {
    Object.assign(this, partial);
  }
}

class AppListResDTO {
  @Expose()
  @Type(() => PagenationResDTO)
  pageInfo: PagenationResDTO;

  @Expose()
  @Type(() => AppResDTO)
  list: AppResDTO[];

  constructor(partial: Partial<AppListResDTO>) {
    Object.assign(this, partial);
  }
}

export { AppResDTO, MenuResDTO, AppListResDTO };
