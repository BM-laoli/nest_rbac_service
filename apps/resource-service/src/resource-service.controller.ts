import { Controller, Get } from '@nestjs/common';
import { ResourceServiceService } from './resource-service.service';
import { ZKService } from '@app/core/modules';

@Controller()
export class ResourceServiceController {
  constructor(
    private readonly resourceServiceService: ResourceServiceService,
    private readonly zkService: ZKService,
  ) {
    // @TODO: 思考一下这个同步异步的问题
    this.zkService.getConfig('AuthInfo').then((v: any) => {
      console.log(v);
    });
  }

  @Get()
  getHello(): string {
    return this.resourceServiceService.getHello();
  }
}
