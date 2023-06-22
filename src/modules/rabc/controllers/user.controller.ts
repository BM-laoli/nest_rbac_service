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
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import UserService from '../services/user.service';
import { ClassSerializerMysqlInterceptor } from 'src/core/interceptor/classSerializerMysql.interceptor';
import { MysqlEntityClass } from 'src/core/decorators/mysqlEntityClass.decorator';
import { NotAuth } from 'src/core/decorators/notAuth.decorator';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/core/decorators/ApiPaginatedResponse.decorator';
import { PagenationWrapResDTO } from 'src/dto/response/responseBase.dto';
import {
  UserDetailResDTO,
  UserInfoListResDTO,
  UserInfoResDTO,
} from 'src/dto/response/rbac.dto';
import { PagenationReqDTO } from 'src/dto/request/requestBase.dto';
import { UpdateUserInfoReqDTO } from 'src/dto/request/rbac.dto';

@Controller({
  path: '/user',
  scope: Scope.REQUEST,
})
@ApiExtraModels(PagenationWrapResDTO, UserDetailResDTO)
@ApiTags('user')
@SerializeOptions({
  enableImplicitConversion: false,
})
@UseInterceptors(ClassSerializerMysqlInterceptor)
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users-page')
  @NotAuth()
  @MysqlEntityClass(UserInfoListResDTO)
  @ApiPaginatedResponse(UserDetailResDTO)
  async getUserList(
    @Query() pagenation: PagenationReqDTO,
  ): Promise<UserInfoListResDTO> {
    const res = await this.userService.getUserList(pagenation);
    return res;
  }

  @Get('/user-info/:id')
  @NotAuth()
  @MysqlEntityClass(UserInfoResDTO)
  @ApiResponse({
    type: UserInfoResDTO,
  })
  getUserInfo(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserInfo(id);
  }

  @Put('/update-user')
  @NotAuth()
  @MysqlEntityClass(UserInfoResDTO)
  @ApiResponse({ type: UserInfoResDTO })
  updateUser(@Body() userInfo: UpdateUserInfoReqDTO) {
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
