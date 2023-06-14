import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
  ParseArrayPipe,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ZKService } from 'src/core/zk/zk.service';
import { MysqlEntityClass } from 'src/decorators/MysqlEntityClass.decorator';
import { TestDto } from 'src/dto/userInfo.dto';
import { User_db2 } from 'src/entities/rbac_db_1/te2.entity';
import { ClassSerializerMysqlInterceptor } from 'src/interceptor/classSerializerMysql.interceptor';
import { VOTest } from 'src/vo/userInfo.vo';
import { Serializer } from 'v8';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly zkConfig: ZKService,
    private readonly tsService: TestService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get('/t1')
  async t1() {
    const value = await this.zkConfig.getConfig(
      '/RBAC_Service/RESTAPI/a/b/c/d',
    );

    // await this.tsService.t1({
    //   username: '2',
    //   password: '123',
    //   update_time: '123',
    //   create_time: '123',
    //   email: '123',
    //   state: 0,
    // });
    // await this.tsService.t2({
    //   username: '2',
    // });

    this.logger.log('logger', TestController.name);
    throw new Error('error i have some error');
    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );
  }

  @Post('/t1')
  async postT1(@Body() testDto: TestDto) {
    console.log(testDto);
    return testDto;
  }

  @Post('/t2')
  createBulk(
    @Body('items', new ParseArrayPipe({ items: TestDto }))
    createUserDtos: TestDto[],

    @Body('li', new ParseArrayPipe({ items: TestDto }))
    createUserDtosLi: TestDto[],
  ) {
    return 'This action adds new users';
  }

  // 如果你需要手动处理 array 比如 GET /?ids=1,2,3
  @Get('/t2')
  findByIds(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ) {
    return 'This action returns users by ids';
  }

  // 以上都是进入的现在是实际需要validation 出去的 需要 serialization
  @Get('/t3')
  @SerializeOptions({})
  @MysqlEntityClass(VOTest)
  @UseInterceptors(ClassSerializerMysqlInterceptor)
  // async findT3(): Promise<Array<VOTest>> {
  async findT3(): Promise<Array<VOTest>> {
    const value = (await this.tsService.t3()) as any;
    return value;
  }
}
