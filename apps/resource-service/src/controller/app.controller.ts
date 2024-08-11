import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
  Post,
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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppService } from '../service/app.service';
import { ClassSerializerMysqlInterceptor } from '@app/core/interceptor/classSerializerMysql.interceptor';
import { MysqlEntityClass } from '@app/core/decorators/mysqlEntityClass.decorator';
import { AppListResDTO, AppResDTO } from '../dto/response/r-s.dto';
import { AppCreateReqDTO } from '../dto/request/r-s.dto';
import { ApiPaginatedResponse } from '@app/core/decorators/apiPaginatedResponse.decorator';
import { PagenationWrapResDTO } from '@app/core/dto/responseBase.dto';
import { PagenationReqDTO } from '@app/core/dto/requestBase.dto';

// 注意可以递归的树结构
@Controller({
  path: '/app',
  scope: Scope.REQUEST,
})
@ApiTags('app')
@ApiExtraModels(PagenationWrapResDTO)
@SerializeOptions({
  enableImplicitConversion: false,
})
@ApiBearerAuth()
@UseInterceptors(ClassSerializerMysqlInterceptor)
export default class AppController {
  constructor(
    private readonly appService: AppService,
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
  @MysqlEntityClass(AppResDTO) // 它会在数据出去 的时候（从controller）经过 ClassSerializerMysqlInterceptor 从而被过滤和格式化掉
  @ApiResponse({
    type: AppResDTO,
  })
  addMenu(@Body() createMenu: AppCreateReqDTO) {
    try {
      return this.appService.addApp(createMenu);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('创建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/all')
  // @NotAuth()
  @MysqlEntityClass(AppListResDTO) // 这两个要求是相互关联的1
  @ApiPaginatedResponse(AppResDTO) // 这两个要求是相互关联的2
  // 这个值必选传 但是我们把 -1 当做不存在的查询条件
  getAllACB(@Query() pagenation: PagenationReqDTO) {
    try {
      return this.appService.getAllApp(pagenation);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
