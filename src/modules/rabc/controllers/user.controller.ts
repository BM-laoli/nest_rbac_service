import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
  UseInterceptors,
} from '@nestjs/common';
import UserService from '../services/user.service';
import { log } from 'console';
import { ClassSerializerMysqlInterceptor } from 'src/core/interceptor/classSerializerMysql.interceptor';
import { MysqlEntityClass } from 'src/core/decorators/mysqlEntityClass.decorator';
import { UserInfoListVO } from 'src/vo/userInfo.vo';
import { NotAuth } from 'src/core/decorators/notAuth.decorator';
import { PagenationDTO } from 'src/dto/base.dto';
import { UserInfoVO } from 'src/vo/auth.vo';

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
  updateUser() {
    //
  }

  @Delete('/delete-user')
  deleteUser() {
    //
  }
}
