import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

export abstract class Base {
  // 以下三个是 公用的
  // @Column({
  //   type: 'boolean',
  //   default: false,
  // })
  // isDeleted: boolean;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;
}

@Entity('User')
export class UserInfo extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username?: string;

  @Column()
  email?: string;

  @Column()
  password: string;

  @Column({
    type: 'int',
    default: 0,
    comment: '1 禁用 2 启用',
  })
  status: number;

  @Column()
  phone?: string;
}

class UserInfoResDTO implements UserInfo {
  @Exclude()
  password: string;

  @Exclude()
  id: number;

  @Exclude()
  state: number;

  // @Exclude()
  // isDeleted: boolean;

  @Expose()
  @ApiProperty()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone?: string;

  @ApiProperty()
  @Expose()
  create_time: Date;

  @ApiProperty()
  @Expose()
  update_time: Date;

  constructor(partial: Partial<UserInfoResDTO>) {
    Object.assign(this, partial);
  }
  status: number;
}

class AuthInfoResDTO {
  @ApiProperty({
    description: 'token',
  })
  @Expose()
  public token: string;

  @Expose()
  @Type(() => UserInfoResDTO)
  @ApiProperty({
    type: UserInfoResDTO,
  })
  userInfo: UserInfoResDTO;

  constructor(partial: Partial<AuthInfoResDTO>) {
    Object.assign(this, partial);
  }
}

export { PagenationResDTO, PagenationWrapResDTO, AuthInfoResDTO };
