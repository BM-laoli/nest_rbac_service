import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

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
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger,
  ) {}

  throwError(message: string, httpCode: HttpStatus) {
    throw new HttpException(
      {
        status: httpCode,
        error: message,
      },
      httpCode,
    );
  }

  @Get('/users-page')
  @MysqlEntityClass(UserInfoListResDTO)
  @ApiPaginatedResponse(UserDetailResDTO)
  async getUserList(
    @Query() pagenation: PagenationReqDTO,
  ): Promise<UserInfoListResDTO> {
    try {
      const res = await this.userService.getUserList(pagenation);
      return res;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/user-info/:id')
  @MysqlEntityClass(UserInfoResDTO)
  @ApiResponse({
    type: UserInfoResDTO,
  })
  getUserInfo(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.userService.getUserInfo(id);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/update-user')
  @MysqlEntityClass(UserInfoResDTO)
  @ApiResponse({ type: UserInfoResDTO })
  updateUser(@Body() userInfo: UpdateUserInfoReqDTO) {
    try {
      return this.userService.updateUser(userInfo);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/delete-user')
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
    try {
      return this.userService.deleteUser(ids);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
