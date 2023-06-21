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
import { UserInfoDetailInfo, UserInfoListVO } from 'src/vo/userInfo.vo';
import { NotAuth } from 'src/core/decorators/notAuth.decorator';
import { PagenationDTO } from 'src/dto/base.dto';
import { UserInfoVO } from 'src/vo/auth.vo';
import { UpdateUserInfoDTO } from 'src/dto/userInfo.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/core/decorators/ApiPaginatedResponse.decorator';
import { PagenationVO, PagenationWrapVO } from 'src/vo/base.vo';

@Controller({
  path: '/user',
  scope: Scope.REQUEST,
})
@ApiExtraModels(PagenationWrapVO, UserInfoDetailInfo)
@ApiTags('user')
@UseInterceptors(ClassSerializerMysqlInterceptor)
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users-page')
  @NotAuth()
  @MysqlEntityClass(UserInfoListVO)
  @ApiPaginatedResponse(UserInfoDetailInfo)
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
