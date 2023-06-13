import { Controller, Get } from '@nestjs/common';
import { ZKService } from './core/zk/zk.service';

@Controller('test')
export class AppController {
  constructor(private readonly zkConfig: ZKService) {}

  @Get('/t1')
  async t1() {
    const value = await this.zkConfig.getConfig(
      '/RBAC_Service/RESTAPI/a/b/c/d',
    );
    return {
      config: value,
    };
  }
}
