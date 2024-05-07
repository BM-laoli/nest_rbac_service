import { Controller, Get, Inject, LoggerService } from '@nestjs/common';
import { ResourceServiceService } from './resource-service.service';
import { ZKService } from '@app/core/modules';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class ResourceServiceController {
  constructor(
    private readonly resourceServiceService: ResourceServiceService,
    private readonly zkService: ZKService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // @TODO: 思考一下这个同步异步的问题
    this.zkService.getConfig('AuthInfo').then((v: any) => {
      console.log(v);
    });

    this.logger.error('error----ssss--');
  }

  @Get()
  getHello() {
    return this.resourceServiceService.getHello();
  }
}
