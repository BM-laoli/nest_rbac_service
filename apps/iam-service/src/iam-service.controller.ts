import { Controller, Get } from '@nestjs/common';
import { IamServiceService } from './iam-service.service';
import { CoreService } from '@app/core';

@Controller()
export class IamServiceController {
  constructor(
    private readonly iamServiceService: IamServiceService,
    private readonly coreService: CoreService,
  ) {}

  @Get()
  getHello(): string {
    return this.coreService.coreInfo();
  }
}
