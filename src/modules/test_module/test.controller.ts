import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZKService } from 'src/core/zk/zk.service';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly zkConfig: ZKService,
    private readonly tsService: TestService,
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

    // throw new Error('error i have some error');
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
