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
import ACBService from '../services/acb.service';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializerMysqlInterceptor } from 'src/core/interceptor/classSerializerMysql.interceptor';
import { PagenationWrapResDTO } from 'src/dto/response/responseBase.dto';
import { PagenationReqDTO } from 'src/dto/request/requestBase.dto';
import { MysqlEntityClass } from 'src/core/decorators/mysqlEntityClass.decorator';
import { ACBInfoReqDTO } from 'src/dto/request/rbac.dto';
import {
  ActionButtonListResDTO,
  ActionButtonResDTO,
} from 'src/dto/response/rbac.dto';
import { NotAuth } from 'src/core/decorators/notAuth.decorator';
import { ApiPaginatedResponse } from 'src/core/decorators/ApiPaginatedResponse.decorator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller({
  path: '/acb',
  scope: Scope.REQUEST,
})
@ApiExtraModels(PagenationWrapResDTO)
@ApiTags('acb')
@SerializeOptions({
  enableImplicitConversion: false,
})
@UseInterceptors(ClassSerializerMysqlInterceptor)
export default class ACBController {
  constructor(
    private readonly acbService: ACBService,
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
  @MysqlEntityClass(ActionButtonResDTO)
  @ApiResponse({
    type: ActionButtonResDTO,
  })
  addACB(@Body() createACBDTO: ACBInfoReqDTO) {
    try {
      return this.acbService.addACB(createACBDTO);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('创建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/all')
  @MysqlEntityClass(ActionButtonListResDTO)
  @ApiPaginatedResponse(ActionButtonResDTO)
  getAllACB(@Query() pagenation: PagenationReqDTO) {
    try {
      return this.acbService.getAllACB(pagenation);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/detail/:id')
  @MysqlEntityClass(ActionButtonResDTO)
  @ApiResponse({
    type: ActionButtonResDTO,
  })
  getACBDetail(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.acbService.getACBDetail(id);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/update')
  @MysqlEntityClass(ActionButtonResDTO)
  @ApiResponse({ type: ActionButtonResDTO })
  updateACB(@Body() ACBInfo: ACBInfoReqDTO) {
    try {
      return this.acbService.updateACB(ACBInfo);
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
      return this.acbService.deleteACB(ids);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.throwError('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
