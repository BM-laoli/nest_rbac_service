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
  Query,
  Scope,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import RoleService from '../services/role.service';
import { NotAuth } from 'src/core/decorators/notAuth.decorator';
import { MysqlEntityClass } from 'src/core/decorators/mysqlEntityClass.decorator';
import { ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagenationReqDTO } from 'src/dto/request/requestBase.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/ApiPaginatedResponse.decorator';
import {
  RoleDetailResDTO,
  RoleInfoListResDTO,
  RoleInfoResDTO,
} from 'src/dto/response/rbac.dto';
import { ClassSerializerMysqlInterceptor } from 'src/core/interceptor/classSerializerMysql.interceptor';
import { UpdateAndCreateRoleInfoReqDTO } from 'src/dto/request/rbac.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// 比较难搞....2023/06/23 等待重构
@Controller({
  path: 'role',
  scope: Scope.REQUEST,
})
@ApiTags('role')
@SerializeOptions({
  enableImplicitConversion: false,
})
@UseInterceptors(ClassSerializerMysqlInterceptor)
export default class RoleController {
  constructor(
    private readonly roleService: RoleService,
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

  // 获取所有角色
  @Get('/all')
  @MysqlEntityClass(RoleInfoListResDTO)
  @ApiPaginatedResponse(RoleInfoResDTO)
  getAllRoles(
    @Query() pagenation: PagenationReqDTO,
  ): Promise<RoleInfoListResDTO> {
    try {
      return this.roleService.getAllRoles(pagenation);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 获取角色详情
  @Get('/detail/:id')
  @MysqlEntityClass(RoleDetailResDTO)
  @ApiResponse({ type: RoleDetailResDTO })
  async getRoleDetail(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.roleService.getRoleDetail(id);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 新增角色
  @Post('/add')
  @MysqlEntityClass(RoleDetailResDTO)
  @ApiResponse({
    type: RoleDetailResDTO,
  })
  async addRole(@Body() body: UpdateAndCreateRoleInfoReqDTO) {
    try {
      return this.roleService.addRole(body);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('新增失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 修改角色
  @MysqlEntityClass(RoleDetailResDTO)
  @ApiResponse({ type: RoleDetailResDTO })
  async updateRole(@Body() roleInfo: UpdateAndCreateRoleInfoReqDTO) {
    try {
      return this.roleService.updateRole(roleInfo);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 删除角色
  @Delete('/delete')
  async deleteRole(
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
      return this.roleService.deleteRole(ids);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
