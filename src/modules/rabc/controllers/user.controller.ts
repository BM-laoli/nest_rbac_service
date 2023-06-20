import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
  UseInterceptors,
} from '@nestjs/common';
import UserService from '../services/user.service';
import { ClassSerializerMysqlInterceptor } from 'src/core/interceptor/classSerializerMysql.interceptor';
import { MysqlEntityClass } from 'src/core/decorators/mysqlEntityClass.decorator';
import { UserInfoListVO } from 'src/vo/userInfo.vo';
import { NotAuth } from 'src/core/decorators/notAuth.decorator';
import { PagenationDTO } from 'src/dto/base.dto';
import { UserInfoVO } from 'src/vo/auth.vo';
import { UpdateUserInfoDTO } from 'src/dto/userInfo.dto';

@Controller({
  path: '/user',
  scope: Scope.REQUEST,
})
@UseInterceptors(ClassSerializerMysqlInterceptor)
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users-page')
  @NotAuth()
  @MysqlEntityClass(UserInfoListVO)
  async getUserList(
    @Query() pagenation: PagenationDTO,
  ): Promise<UserInfoListVO> {
    const res = await this.userService.getUserList(pagenation);
    return res;
  }

  @Get('/user-info/:id')
  @NotAuth()
  @MysqlEntityClass(UserInfoVO)
  getUserInfo(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserInfo(id);
  }

  @Put('/update-user')
  @NotAuth()
  @MysqlEntityClass(UserInfoVO)
  updateUser(@Body() userInfo: UpdateUserInfoDTO) {
    return this.userService.updateUser(userInfo);
  }

  @Delete('/delete-user')
  @NotAuth()
  @MysqlEntityClass(null)
  deleteUser(
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
        separator: ',',
      }),
    )
    ids: number[],
  ) {
    return this.userService.deleteUser(ids);
  }
}
