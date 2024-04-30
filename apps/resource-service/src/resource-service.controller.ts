import { Controller, Get } from '@nestjs/common';
import { ResourceServiceService } from './resource-service.service';

@Controller()
export class ResourceServiceController {
  constructor(private readonly resourceServiceService: ResourceServiceService) {}

  @Get()
  getHello(): string {
    return this.resourceServiceService.getHello();
  }
}
