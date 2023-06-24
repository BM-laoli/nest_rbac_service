import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
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
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClassSerializerMysqlInterceptor } from 'src/core/interceptor/classSerializerMysql.interceptor';
import { PagenationWrapResDTO } from 'src/dto/response/responseBase.dto';
import PermissionService from '../services/permission.service';
import { PagenationReqDTO } from 'src/dto/request/requestBase.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MysqlEntityClass } from 'src/core/decorators/mysqlEntityClass.decorator';
import {
  ActionButtonResDTO,
  PermissionListResDTO,
  PermissionResDTO,
  PermissionSimpleResDTO,
} from 'src/dto/response/rbac.dto';
import { NotAuth } from 'src/core/decorators/notAuth.decorator';
import { PermissionReqDTO } from 'src/dto/request/rbac.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/ApiPaginatedResponse.decorator';

@Controller({
  path: '/permission',
  scope: Scope.REQUEST,
})
@ApiTags('permission')
@ApiExtraModels(PagenationWrapResDTO)
@SerializeOptions({
  enableImplicitConversion: false,
})
@ApiBearerAuth()
@UseInterceptors(ClassSerializerMysqlInterceptor)
export default class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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

  @Post('/add')
  @MysqlEntityClass(PermissionResDTO)
  @ApiResponse({
    type: ActionButtonResDTO,
  })
  addPermission(@Body() permissionInfo: PermissionReqDTO) {
    try {
      return this.permissionService.addPermission(permissionInfo);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('创建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/all')
  @MysqlEntityClass(PermissionListResDTO)
  @ApiPaginatedResponse(PermissionSimpleResDTO)
  getAllACB(@Query() pagenation: PagenationReqDTO) {
    try {
      return this.permissionService.getAllPermission(pagenation);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/detail/:id')
  @MysqlEntityClass(PermissionResDTO)
  @ApiResponse({
    type: PermissionResDTO,
  })
  getACBDetail(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.permissionService.getPermissionDetail(id);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/update')
  @MysqlEntityClass(PermissionResDTO)
  @ApiResponse({ type: PermissionResDTO })
  updateACB(@Body() permissionInfo: PermissionReqDTO) {
    try {
      return this.permissionService.updatePermission(permissionInfo);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/delete')
  deleteACB(
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
      return this.permissionService.deletePermission(ids);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
