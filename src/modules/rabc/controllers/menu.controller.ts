import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import MenuService from '../services/menu.service';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializerMysqlInterceptor } from 'src/core/interceptor/classSerializerMysql.interceptor';
import { PagenationWrapResDTO } from 'src/dto/response/responseBase.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MysqlEntityClass } from 'src/core/decorators/mysqlEntityClass.decorator';
import { MenuResDTO } from 'src/dto/response/rbac.dto';
import { NotAuth } from 'src/core/decorators/notAuth.decorator';
import { MenuCreateReqDTO } from 'src/dto/request/rbac.dto';

// 注意可以递归的树结构
@Controller({
  path: '/menu',
  scope: Scope.REQUEST,
})
@ApiTags('menu')
@ApiExtraModels(PagenationWrapResDTO)
@SerializeOptions({
  enableImplicitConversion: false,
})
@UseInterceptors(ClassSerializerMysqlInterceptor)
export default class MenuController {
  constructor(
    private readonly menuService: MenuService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {} // please do CRUD here

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
  @MysqlEntityClass(MenuResDTO)
  @ApiResponse({
    type: MenuResDTO,
  })
  addMenu(@Body() createMenu: MenuCreateReqDTO) {
    try {
      return this.menuService.addMenu(createMenu);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('创建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/all')
  @MysqlEntityClass(MenuResDTO)
  @ApiResponse({
    type: MenuResDTO,
  })
  // 这个值必选传 但是我们把 -1 当做不存在的查询条件
  getAllACB(@Query('parentId', ParseIntPipe) parentId: number) {
    try {
      return this.menuService.getAllMenus(parentId <= 0 ? null : parentId);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/update')
  @MysqlEntityClass(MenuResDTO)
  @ApiResponse({ type: MenuResDTO })
  updateACB(@Body() menuInfo: MenuCreateReqDTO) {
    try {
      return this.menuService.updateACB(menuInfo);
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
      return this.menuService.deleteACB(ids);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
